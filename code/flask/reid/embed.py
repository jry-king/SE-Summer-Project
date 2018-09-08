#!/usr/bin/env python3
from argparse import ArgumentParser
from importlib import import_module
from itertools import count
import os

import h5py
import json
import numpy as np
import tensorflow as tf

import common

parser = ArgumentParser(description='Embed a dataset using a trained network.')

# Required

parser.add_argument(
    '--experiment_root', required=True,
    help='Location used to store checkpoints and dumped data.')

parser.add_argument(
    '--dataset', required=True,
    help='Path to the dataset csv file to be embedded.')

# Optional

parser.add_argument(
    '--image_root', type=common.readable_directory,
    help='Path that will be pre-pended to the filenames in the train_set csv.')

parser.add_argument(
    '--checkpoint', default=None,
    help='Name of checkpoint file of the trained network within the experiment '
         'root. Uses the last checkpoint if not provided.')

parser.add_argument(
    '--loading_threads', default=8, type=common.positive_int,
    help='Number of threads used for parallel data loading.')

parser.add_argument(
    '--batch_size', default=256, type=common.positive_int,
    help='Batch size used during evaluation, adapt based on available memory.')

parser.add_argument(
    '--filename', default=None,
    help='Name of the HDF5 file in which to store the embeddings, relative to'
         ' the `experiment_root` location. If omitted, appends `_embeddings.h5`'
         ' to the dataset name.')

parser.add_argument(
    '--quiet', action='store_true', default=False,
    help='Don\'t be so verbose.')


def main():
    # Verify that parameters are set correctly.
    args = parser.parse_args()

    # Possibly auto-generate the output filename.
    if args.filename is None:
        basename = os.path.basename(args.dataset)
        args.filename = os.path.splitext(basename)[0] + '_embeddings.h5'

    # Load the args from the original experiment.
    args_file = os.path.join(args.experiment_root, 'args.json')

    if os.path.isfile(args_file):
        if not args.quiet:
            print('Loading args from {}.'.format(args_file))
        with open(args_file, 'r') as f:
            args_resumed = json.load(f)

        # Add arguments from training.
        for key, value in args_resumed.items():
            args.__dict__.setdefault(key, value)
        # won't be used
        args.image_root = args.image_root or args_resumed['image_root']
    else:
        raise IOError('`args.json` could not be found in: {}'.format(args_file))

    if not args.quiet:
        print('Evaluating using the following parameters:')
        for key, value in sorted(vars(args).items()):
            print('{}: {}'.format(key, value))

    # Load the data from the CSV file.
    _, data_fids = common.load_dataset(args.dataset, args.image_root)

    net_input_size = (args.net_input_height, args.net_input_width)
    pre_crop_size = (args.pre_crop_height, args.pre_crop_width)

    # Setup a tf Dataset containing all images.
    dataset = tf.data.Dataset.from_tensor_slices(data_fids)

    # Convert filenames to actual image tensors.
    dataset = dataset.map(
        lambda fid: common.fid_to_image(
            fid, tf.constant('dummy'), image_root=args.image_root,
            image_size=pre_crop_size if args.crop_augment else net_input_size),
        num_parallel_calls=args.loading_threads)

    modifiers = ['original']

    # Group it back into PK batches.
    dataset = dataset.batch(args.batch_size)

    # Overlap producing and consuming.
    dataset = dataset.prefetch(1)

    images, _, _ = dataset.make_one_shot_iterator().get_next()

    # Create the model and an embedding head.
    model = import_module('nets.' + args.model_name)
    head = import_module('heads.' + args.head_name)

    endpoints, body_prefix = model.endpoints(images, is_training=False)
    with tf.name_scope('head'):
        endpoints = head.head(endpoints, args.embedding_dim, is_training=False)

    with h5py.File(args.filename, 'w') as f_out, tf.Session() as sess:
        # Initialize the network/load the checkpoint.
        if args.checkpoint is None:
            checkpoint = tf.train.latest_checkpoint(args.experiment_root)
        else:
            checkpoint = os.path.join(args.experiment_root, args.checkpoint)
        if not args.quiet:
            print('Restoring from checkpoint: {}'.format(checkpoint))
        tf.train.Saver().restore(sess, checkpoint)

        # Go ahead and embed the whole dataset, with all augmented versions too.
        emb_storage = np.zeros(
            (len(data_fids) * len(modifiers), args.embedding_dim), np.float32)
        for start_idx in count(step=args.batch_size):
            try:
                emb = sess.run(endpoints['emb'])
                print('\rEmbedded batch {}-{}/{}'.format(
                        start_idx, start_idx + len(emb), len(emb_storage)), flush=True, end='')
                emb_storage[start_idx:start_idx + len(emb)] = emb
            except tf.errors.OutOfRangeError:
                break  # This just indicates the end of the dataset.

        print()

        # Store the final embeddings.
        emb_dataset = f_out.create_dataset('emb', data=emb_storage)

        # Store information about the produced augmentation and in case no crop
        # augmentation was used, if the images are resized or avg pooled.
        f_out.create_dataset('augmentation_types', data=np.asarray(modifiers, dtype='|S'))


if __name__ == '__main__':
    main()

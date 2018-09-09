#!/usr/bin/env python3
import os
from importlib import import_module
from itertools import count
from multiprocessing import Process

import h5py
import numpy as np
import tensorflow as tf

import tripletreid.loss
import tripletreid.common


def generatecsv(path, csv):
    files = os.listdir(path)
    f = open(csv, "w")
    file = files[0]
    f.write(str(1) + ',' + file + '\n')
    f.write(str(1) + ',' + file + '\n')
    f.close()


def embed(experiment_root, dataset, filename, image_root):
    os.system("python tripletreid\\embed.py --quiet --experiment_root " + experiment_root + " --dataset " + dataset
              + " --filename " + filename + " --image_root " + image_root)


def evaluation(excluder, query_dataset, query_embeddings, gallery_dataset, gallery_embeddings, metric, batch_size):
    # Load the query and gallery data from the CSV files.
    query_pids, query_fids = tripletreid.common.load_dataset(query_dataset, None)
    gallery_pids, gallery_fids = tripletreid.common.load_dataset(gallery_dataset, None)

    # Load the two datasets fully into memory.
    with h5py.File(query_embeddings, 'r') as f_query:
        query_embs = np.array(f_query['emb'])
    with h5py.File(gallery_embeddings, 'r') as f_gallery:
        gallery_embs = np.array(f_gallery['emb'])

    # Just a quick sanity check that both have the same embedding dimension!
    query_dim = query_embs.shape[1]
    gallery_dim = gallery_embs.shape[1]
    if query_dim != gallery_dim:
        raise ValueError('Shape mismatch between query ({}) and gallery ({}) '
                         'dimension'.format(query_dim, gallery_dim))

    # Setup the dataset specific matching function
    excluder = import_module('tripletreid.excluders.' + excluder).Excluder(gallery_fids)

    # We go through the queries in batches, but we always need the whole gallery
    batch_pids, batch_fids, batch_embs = tf.data.Dataset.from_tensor_slices(
        (query_pids, query_fids, query_embs)
    ).batch(batch_size).make_one_shot_iterator().get_next()

    batch_distances = tripletreid.loss.cdist(batch_embs, gallery_embs, metric=metric)

    # Loop over the query embeddings.
    with tf.Session() as sess:
        for start_idx in count(step=batch_size):
            try:
                # Compute distance to all gallery embeddings
                distances, pids, fids = sess.run([
                    batch_distances, batch_pids, batch_fids])
                print('\rEvaluating batch {}-{}/{}'.format(
                        start_idx, start_idx + len(fids), len(query_fids)),
                      flush=True, end='')
                print()
            except tf.errors.OutOfRangeError:
                print()  # Done!
                break

            # Convert the array of objects back to array of strings
            pids, fids = np.array(pids, '|U'), np.array(fids, '|U')

            # Compute the pid matches
            pid_matches = gallery_pids[None] == pids[:,None]

            # Get a mask indicating True for those gallery entries that should
            # be ignored for whatever reason (same camera, junk, ...) and
            # exclude those in a way that doesn't affect CMC and mAP.
            mask = excluder(fids)
            distances[mask] = np.inf
            pid_matches[mask] = False

            # Keep track of statistics. Invert distances to scores using any
            # arbitrary inversion, as long as it's monotonic and well-behaved,
            # it won't change anything.
            for i in range(len(distances)):
                print(gallery_fids[np.argsort(distances[i])[0]])


def calcreid(experiment_root, query_dataset, gallery_dataset,
             query_image_root, gallery_image_root, query_filename, gallery_filename):
    p0 = Process(target=generatecsv, args=(query_image_root, query_dataset))
    p0.start()
    p0.join()
    p1 = Process(target=embed, args=(experiment_root, query_dataset,
                                     query_filename, query_image_root))
    p2 = Process(target=embed, args=(experiment_root, gallery_dataset,
                                     gallery_filename, gallery_image_root))
    p1.start()
    p2.start()
    p1.join()
    p2.join()
    evaluation("diagonal", query_dataset, query_filename, gallery_dataset, gallery_filename,
               "euclidean", 256)

import tensorflow as tf

from object_detection.utils import label_map_util


import numpy as np
import os
import time
import matplotlib.image as mpimg
from imgaug import augmenters as iaa

# Path to frozen detection graph. This is the actual model that is used for the object detection.
PATH_TO_CKPT = '/Users/darlenelee/Documents/vir_env/models/research/object_detection/ssdlite_mobilenet_v2_coco_2018_05_09/frozen_inference_graph.pb'

# List of the strings that is used to add correct label for each box.
PATH_TO_LABELS = '/Users/darlenelee/Documents/vir_env/models/research/object_detection/data/mscoco_label_map.pbtxt'

NUM_CLASSES = 90

MAX_WIDTH = 1024


# 加载模型
detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

# 加载类型
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES,
                                                            use_display_name=True)
category_index = label_map_util.create_category_index(categories)

def run_inference_for_single_image(image):
  graph = detection_graph
  with graph.as_default():
    with tf.Session() as sess:
      # Get handles to input and output tensors
      ops = tf.get_default_graph().get_operations()
      all_tensor_names = {output.name for op in ops for output in op.outputs}
      tensor_dict = {}
      for key in [
          'num_detections', 'detection_boxes', 'detection_scores',
          'detection_classes', 'detection_masks'
      ]:
        tensor_name = key + ':0'
        if tensor_name in all_tensor_names:
          tensor_dict[key] = tf.get_default_graph().get_tensor_by_name(
              tensor_name)
      if 'detection_masks' in tensor_dict:
        # The following processing is only for single image
        detection_boxes = tf.squeeze(tensor_dict['detection_boxes'], [0])
        detection_masks = tf.squeeze(tensor_dict['detection_masks'], [0])
        # Reframe is required to translate mask from box coordinates to image coordinates and fit the image size.
        real_num_detection = tf.cast(tensor_dict['num_detections'][0], tf.int32)
        detection_boxes = tf.slice(detection_boxes, [0, 0], [real_num_detection, -1])
        detection_masks = tf.slice(detection_masks, [0, 0, 0], [real_num_detection, -1, -1])
        #detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
        #    detection_masks, detection_boxes, image.shape[0], image.shape[1])
        #detection_masks_reframed = tf.cast(
        #    tf.greater(detection_masks_reframed, 0.5), tf.uint8)
        # Follow the convention by adding back the batch dimension
        #tensor_dict['detection_masks'] = tf.expand_dims(
        #    detection_masks_reframed, 0)
      image_tensor = tf.get_default_graph().get_tensor_by_name('image_tensor:0')

      # Run inference
      output_dict = sess.run(tensor_dict,
                             feed_dict={image_tensor: np.expand_dims(image, 0)})

      # all outputs are float32 numpy arrays, so convert types as appropriate
      output_dict['num_detections'] = int(output_dict['num_detections'][0])
      output_dict['detection_classes'] = output_dict[
          'detection_classes'][0].astype(np.uint8)
      output_dict['detection_boxes'] = output_dict['detection_boxes'][0]
      output_dict['detection_scores'] = output_dict['detection_scores'][0]
      if 'detection_masks' in output_dict:
        output_dict['detection_masks'] = output_dict['detection_masks'][0]

    result = []
    scores = output_dict['detection_scores']
    boxes = output_dict['detection_boxes']
    classes = output_dict['detection_classes']
    for score in scores:
        if score > 0.5:
            index = scores[0].tolist().index(score)
            cls = int(classes[0][index])
            box = boxes[0][index]
            print(cls, score)
            result.append({'cls': cls, 'box': box.tolist(), 'score': score})
            # sess.reset('')
    sess.close()
  return result


# 将图片加载到numpy数组中
def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)


def detect(image_path):
    with detection_graph.as_default():
        with tf.Session(graph=detection_graph) as sess:
            # Definite input and output Tensors for detection_graph
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
            # Each box represents a part of the image where a particular object was detected.
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            # Each score represent how level of confidence for each of the objects.
            # Score is shown on the result image, together with the class label.
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')

            start_time = time.time()
            image = mpimg.imread(image_path)

            print('===Read Spend:', time.time() - start_time)
            start_time = time.time()


            # if image.shape[1] > MAX_WIDTH:
            #     aug = iaa.Scale({"width": MAX_WIDTH, "height": "keep-aspect-ratio"})
            #     image = aug.augment_images([image])[0]
            #
            #     print('===Scale Spend:', time.time() - start_time)
            #     start_time = time.time()

            image_np_expanded = np.expand_dims(image, axis=0)
            print('===Expand Spend:', time.time() - start_time)
            start_time = time.time()

            # Actual detection.
            (boxes, scores, classes, num) = sess.run(
                [detection_boxes, detection_scores, detection_classes, num_detections],
                feed_dict={image_tensor: image_np_expanded})

            print('===Detection Spend:', time.time() - start_time)
            start_time = time.time()

            result = []
            for score in scores[0]:
                if score > 0.5:
                    index = scores[0].tolist().index(score)
                    cls = int(classes[0][index])
                    box = boxes[0][index]
                    print(cls, score)
                    result.append({'cls': cls, 'box': box.tolist(), 'score': score})
            # sess.reset('')
            sess.close()

    return result

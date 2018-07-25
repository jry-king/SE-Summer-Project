import tensorflow as tf

from object_detection.utils import label_map_util

from copy import copy
import numpy as np
import os
import time
import matplotlib.image as mpimg
from imgaug import augmenters as iaa
from PIL import Image
import csv
import cv2
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


# 将图片加载到numpy数组中
def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)


def detect(image,csvFile,index):
    origin=copy(image)
    csvfile = open(csvFile,'a')
    writer = csv.writer(csvfile)
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
            #image = mpimg.imread(image_path)

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
                    j = scores[0].tolist().index(score)
                    cls = int(classes[0][j]);
                    box = boxes[0][j]
                    p1 = box[1] * 1280
                    p2 = box[0] * 720
                    p3 = box[3] * 1280
                    p4 = box[2] * 720
                    region=origin[int(p2):int(p4),int(p1):int(p3)]
                    region = cv2.cvtColor(region, cv2.COLOR_RGB2BGR)
                    img = Image.fromarray(region)
                    relativePath = 'gallery/'+str(index)+'-'+str(j)+'.jpg'
                    resultFileName=os.getcwd()+'/' +relativePath
                    writer.writerow([index+1,relativePath])
                    writer.writerow([index+1,relativePath])

                    img.save(resultFileName)
                    print(cls, score)
                    result.append({'cls': cls, 'box': box.tolist(), 'score': score})
            # sess.reset('')
            sess.close()
    csvfile.close()
    return result

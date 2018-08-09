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


# Load a (frozen) Tensorflow model into memory.
detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

#  Loading label map
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES,
                                                            use_display_name=True)
category_index = label_map_util.create_category_index(categories)


def detect(cameraid, image,csvFile,index):
    origin=copy(image)
    img_size=[len(image[0]),len(image)]
    csvfile = open(csvFile,'a')
    writer = csv.writer(csvfile)
    with detection_graph.as_default():
        with tf.Session(graph=detection_graph) as sess: 
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')    
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')
            image_np_expanded = np.expand_dims(image, axis=0)
            # Actual detection.
            (boxes, scores, classes, num) = sess.run(
                [detection_boxes, detection_scores, detection_classes, num_detections],
                feed_dict={image_tensor: image_np_expanded})
            
            result = []    
            for score in scores[0]:
                if score > 0.5:
                    j = scores[0].tolist().index(score)
                    cls = int(classes[0][j])
                    box = boxes[0][j]
                    p1 = box[1] * img_size[0]
                    p2 = box[0] * img_size[1]
                    p3 = box[3] * img_size[0]
                    p4 = box[2] * img_size[1]
                    region=origin[int(p2):int(p4),int(p1):int(p3)]
                    #if index<100: # dealing with live stream
                    region = cv2.cvtColor(region, cv2.COLOR_RGB2BGR)
                    img = Image.fromarray(region)
                    #if index<100: # dealing with live stream
                    relativePath = 'gallery_live/'+str(cameraid)+'-'+str(index+1)+'-'+str(j)+'.jpg'
                    #else: # dealing with history video
                    #    relativePath = 'gallery_history/'+str(index+1)+'-'+str(j)+'.jpg'
                    resultFileName=os.getcwd()+'/' +relativePath
                    writer.writerow([index+1,str(cameraid)+'-'+str(index+1)+'-'+str(j)+'.jpg'])
                    writer.writerow([index+1,str(cameraid)+'-'+str(index+1)+'-'+str(j)+'.jpg'])
                    img.save(resultFileName)
                    result.append({'cls': cls, 'box': box.tolist(), 'score': score})
            # sess.reset('')
            sess.close()
    csvfile.close()
    return result

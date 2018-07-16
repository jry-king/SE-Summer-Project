import numpy as np
import tensorflow as tf
import torch
import scipy
import os
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2
from utils import label_map_util
from utils import visualization_utils as vis_util
from grpc.beta import implementations
from torchvision import transforms

from PIL import Image
NUM_CLASSES = 90
# Create stub
flags = tf.app.flags
flags.DEFINE_string('input_image_path', 'test_images/image1.jpg', 'input image path')
flags.DEFINE_string('server', '0.0.0.0:3000',
                    'PredictionServer address host:port')

FLAGS = flags.FLAGS
host, port = FLAGS.server.split(':')
image = Image.open(FLAGS.input_image_path).convert('RGB')
transform = transforms.Compose([
    transforms.ToTensor(), 
    ]
)
image_tensor = transform(image)

channel = implementations.insecure_channel(host, int(port))
stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)

# Create prediction request object
request = predict_pb2.PredictRequest()

# Specify model name (must be the same as when the TensorFlow serving serving was started)
request.model_spec.name = 'obj_det'

# Initalize prediction 
# Specify signature name (should be the same as specified when exporting model)
#request.model_spec.signature_name = "detection_signature"

request.inputs['inputs'].CopyFrom(
        tf.contrib.util.make_tensor_proto(image_tensor))


# Call the prediction server

PATH_TO_LABELS = os.path.join('data', 'mscoco_label_map.pbtxt')

# Plot boxes on the input image
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
category_index = label_map_util.create_category_index(categories)
print("calling prediction...\n")
result = stub.Predict(request, 10.0)  # 10 secs timeout
boxes = result.outputs['detection_boxes'].float_val
classes = result.outputs['detection_classes'].float_val
scores = result.outputs['detection_scores'].float_val
image_vis = vis_util.visualize_boxes_and_labels_on_image_array(
    FLAGS.input_image,
    np.reshape(boxes,[100,4]),
    np.squeeze(classes).astype(np.int32),
    np.squeeze(scores),
    category_index,
    use_normalized_coordinates=True,
    line_thickness=8)

# Save inference to disk
scipy.misc.imsave('%s.jpg'%(image_tensor), image_vis)
print (result)


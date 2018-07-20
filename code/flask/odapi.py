from flask import Flask, render_template, request, json
import os
import odapi_server
import numpy as np
import sys
from PIL import Image
# import json


UPLOAD_FOLDER = '/Users/darlenelee/Documents/vir_env/models/research/object_detection/upload'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/")
def index():
    return render_template('index.html')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


class JsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(JsonEncoder, self).default(obj)


@app.route("/upload", methods=['POST'])
def hello():
    file = request.files['file']
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    result = odapi_server.detect(file)
    #file = Image.open(file)
    #file = np.array(file)
    #result = odapi_server.run_inference_for_single_image(file)
    return json.dumps(result, cls=JsonEncoder)


if __name__ == '__main__':
    port = 5000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    app.run(host='0.0.0.0',port = port)

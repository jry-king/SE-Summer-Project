from flask import Flask, render_template, request, json
import os
import odapi_server
import numpy as np
import sys
from PIL import Image
import json
import re
import time
import subprocess as sp
import base64
from flask_cors import *
from io import BytesIO
from tripletreid.reid import calcreid
import csv
UPLOAD_FOLDER = '/Users/darlenelee/Documents/vir_env/models/research/object_detection/upload'
WEBURL = "http://47.106.8.44:8080/"
VIDEO_URL = WEBURL + "live/camera2.m3u8"
app = Flask(__name__)
CORS(app,supports_credentials=True)

@app.route("/")
def index():
    return render_template('index.html')

  
@app.route("/stream", methods=['GET','POST'])
def video():
    postValues= request.form.get("img")
    image_data = re.sub('^data:image/.+;base64,', '', postValues)
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    im.save(os.getcwd()+'/query/query.png')
    csvfile = open('query.csv','w')
    writer = csv.writer(csvfile)
    writer.writerow([1,'query.png'])
    writer.writerow([1,'query.png'])
    csvfile.close()
    index = 0

    while True:
        print("test----")
        start_time = time.time()
        pipe = sp.Popen([ "ffmpeg", "-i", VIDEO_URL,
                "-loglevel", "quiet", # no text output
                "-an",   # disable audio
                "-f", "image2pipe",
                "-pix_fmt", "bgr24",
                "-vcodec", "rawvideo", "-"],
                stdin = sp.PIPE, stdout = sp.PIPE)
        print('===Watching Spend:', time.time() - start_time)

        index = index+1
        raw_image = pipe.stdout.read(1280*720*3)
        image =  np.fromstring(raw_image, dtype='uint8')
        image = np.array(image).reshape(720,1280,3)
        result = odapi_server.detect(image,'gallery.csv',index)

        if index %2 == 0:
            start_time = time.time()
            filename=calcreid("tripletreid/experiment", "query.csv", "gallery.csv", "query", "gallery","query_embeddings.h5", "gallery_embeddings.h5")
            print('===Saving Spend:', time.time() - start_time)

            with open('gallery/'+filename, 'rb') as f: 
                data = f.read()
                encodestr = base64.b64encode(data)
            return json.dumps({'result': filename, "picture": str(encodestr,'utf-8')})


if __name__ == '__main__':
    port = 5000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    app.run(host='0.0.0.0',port = port)

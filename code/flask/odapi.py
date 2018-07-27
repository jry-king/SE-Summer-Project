from flask import Flask, render_template, request, json
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
import requests
import os
from moviepy.editor import VideoFileClip

UPLOAD_FOLDER = '/Users/darlenelee/Documents/vir_env/models/research/object_detection/upload'
WEBURL = "http://47.106.8.44:8080/"
VIDEO_URL1 = WEBURL + "live/camera1.m3u8"
VIDEO_URL2 = WEBURL + "live/camera2.m3u8"
app = Flask(__name__)
CORS(app,supports_credentials=True)

@app.route("/")
def index():
    return render_template('index.html')



@app.route("/history", methods=['GET','POST'])
def download():
    start_time=time.time()
    postValues= request.form.get("img")
    image_data = re.sub('^data:image/.+;base64,', '', postValues)
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    im.save(os.getcwd()+'/query_history/query.png')
    csvfile = open('query_history.csv','w')
    writer = csv.writer(csvfile)
    writer.writerow([1,'query.png'])
    writer.writerow([1,'query.png'])
    csvfile.close()
    #index = 100
    '''source_url = "http://47.106.8.44:8081/api/history/all"
    r = requests.get(source_url)
    array = r.json()
    for item in array:
        historyid=item["historyid"]
        cameraid = item["cameraid"]
        areaid = item["areaid"]
        filename = item["filename"]
        print (cameraid,areaid,filename)
        if historyid == 4:
            url = 'http://47.106.8.44/vod/camera'+ str(cameraid) + '/' + filename + '.mp4'
            r = requests.get(url, stream=True)
            f = open(filename+".mp4", "wb")
            for chunk in r.iter_content(chunk_size=512):
                if chunk:
                    f.write(chunk)   ''' 
    '''clip1 = VideoFileClip('video1.mp4').without_audio().set_fps(1)
    for image_np in clip1.iter_frames(1,False,True,None):
        index = index+1
        result = odapi_server.detect(image_np, 'gallery_history.csv',index)'''
            
    filename=calcreid("tripletreid/experiment", "query_history.csv", "gallery_history.csv", "query_history", "gallery_history","query_embeddings.h5", "gallery_embeddings.h5")

    with open('gallery_history/'+filename, 'rb') as f: 
        data = f.read()
        encodestr = base64.b64encode(data)
    print(time.time()-start_time)
    res_time = filename.split('-')[1]
    id = filename.split('-')[0]
    return json.dumps({"id": id ,"result": filename, "picture": str(encodestr,'utf-8'),"time":"Frame "+res_time})

@app.route("/stream", methods=['GET','POST'])
def video():
    start_time = time.time()
    postValues= request.form.get("img")
    image_data = re.sub('^data:image/.+;base64,', '', postValues)
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    im.save(os.getcwd()+'/query_live/query.png')
    csvfile = open('query_live.csv','w')
    writer = csv.writer(csvfile)
    writer.writerow([1,'query.png'])
    writer.writerow([1,'query.png'])
    csvfile.close()
    index = 0
    for index in list(range(2)):
        pipe1 = sp.Popen([ "ffmpeg", "-i", VIDEO_URL1,
                "-loglevel", "quiet", # no text output
                "-an",   # disable audio
                "-f", "image2pipe",
                "-pix_fmt", "bgr24",
                "-vcodec", "rawvideo", "-"],
                stdin = sp.PIPE, stdout = sp.PIPE)
        pipe2 = sp.Popen([ "ffmpeg", "-i", VIDEO_URL2,
                "-loglevel", "quiet", # no text output
                "-an",   # disable audio
                "-f", "image2pipe",
                "-pix_fmt", "bgr24",
                "-vcodec", "rawvideo", "-"],
                stdin = sp.PIPE, stdout = sp.PIPE)
        cur_time=time.strftime("%Y-%m-%d-%H:%M:%S", time.localtime())
        print(time.time()-start_time)
        #pipe1.wait()
        raw_image = pipe1.stdout.read(1280*720*3)
        image = np.fromstring(raw_image, dtype='uint8')
        if len(image) == 0:
            return json.dumps({"status":500})
        image = np.array(image).reshape(720,1280,3)
        print(time.time()-start_time)
        result = odapi_server.detect(1, image,'gallery_live.csv',index)
        #pipe2.wait()
        raw_image = pipe2.stdout.read(1280*720*3)
        image = np.fromstring(raw_image, dtype='uint8')
        if len(image) == 0:
            return json.dumps({"status":500})
        image = np.array(image).reshape(720,1280,3)
        print(time.time()-start_time)
        result.extend(odapi_server.detect(2, image,'gallery_live.csv',index))
        #print(time.time()-start_time)
        if index %2 == 0:
            if len(result) == 0:
                return json.dumps({"status":500})
            filename=calcreid("tripletreid/experiment", "query_live.csv", "gallery_live.csv", "query_live", "gallery_live","query_embeddings.h5", "gallery_embedding.h5")
            with open('gallery_live/'+filename, 'rb') as f: 
                data = f.read()
                encodestr = base64.b64encode(data)
            print(time.time()-start_time)
            id = filename.split('-')[0]
            return json.dumps({"id":id ,"result": filename, "picture": str(encodestr,'utf-8'), "time":cur_time})


if __name__ == '__main__':
    port = 5000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    app.run(host='0.0.0.0',port = port)

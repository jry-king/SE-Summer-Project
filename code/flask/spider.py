import sys, time, base64
import cv2
import m3u8
import numpy
import subprocess as sp
def main():
    WEBURL = "http://47.106.8.44:8080/"
    VIDEO_URL = WEBURL + "live/camera2.m3u8"
    while True:
        #m3u8_obj = m3u8.load("http://47.106.8.44:8080/live/camera2.m3u8")        
     
        pipe = sp.Popen([ "ffmpeg", "-i", VIDEO_URL,
                "-loglevel", "quiet", # no text output
                "-an",   # disable audio
                "-f", "image2pipe",
                "-pix_fmt", "bgr24",
                "-vcodec", "rawvideo", "-"],
                stdin = sp.PIPE, stdout = sp.PIPE)
        while True:
            raw_image = pipe.stdout.read(1280*720*3)
            image =  numpy.fromstring(raw_image, dtype='uint8')


    
if __name__ == "__main__":
    main()
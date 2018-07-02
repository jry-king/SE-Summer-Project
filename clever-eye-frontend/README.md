- RTMS server:

<code>
docker pull alfg/nginx-rtmp

docker run -it -p 1935:1935 -p 8080:80 --rm alfg/nginx-rtmp
</code>

- ffmpeg live command for mac:

<code> 
ffmpeg -f avfoundation -framerate 30 -i "0" -target pal-vcd ./hello.mpg -f flv rtmp://{server-ip}/stream/{instance-name}
</code>

- HLS url:

<code>
http://{server-ip}/live/{instance-name + '.m3u8'}
</code>

- RTMS server:

```sh
docker pull alfg/nginx-rtmp
docker run -it -p 1935:1935 -p 8080:80 --rm alfg/nginx-rtmp
```

- ffmpeg live command for mac:

```sh
ffmpeg -f avfoundation -framerate 30 -i "0" -target pal-vcd ./hello.mpg -f flv rtmp://{server-ip}:1935/stream/{instance-name}
```

- HLS url:

```sh
http://{server-ip}:8080/live/{instance-name + '.m3u8'}
```

- use nginx-prometheus to export metric data

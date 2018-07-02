- ffmpeg live command for mac:
<code> 
ffmpeg -f avfoundation -framerate 30 -i "0" -target pal-vcd ./hello.mpg -f flv rtmp://{server-ip}/stream/{instance-name}
</code>
- HLS url:
<code>
http://{server-ip}/live/{instance-name + '.m3u8'}
</code>
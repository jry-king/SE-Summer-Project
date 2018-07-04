import React, { Component } from 'react';
import Camera from './Camera';
import {hlsServer} from '../Global';
import { Select,Icon,Button } from 'antd'

import {Cropper} from 'react-image-cropper'

const cameras = [{key:1, x:'10%', y:'10%', url:'camera1'}, {key:2, x:'30%',y:'30%',url:'camera2'}]

const videoWidth = 800
const videoHeight = 400
const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

class Layout extends Component {

    constructor(props){
        super(props)
        this.state={
            backgroundImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAAAQIDBv/EABgQAQEBAQEAAAAAAAAAAAAAAAABAhEh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEGBf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOhkaSDMXI7jKlIrhyKkRUcHGnCsBnYixtYmxUYagXqeAFZjSRGWkRTkPhw+AQ4fAKmxFjRNgjKwHo1QstIzy0iKo0wxVFR0dQJNUmqiNAaCojNaSsM6XNA3lNlNKmkVYT0ugrqbU3SboBqhnrQVGeWmaAC5T6AA6OgAVqbSAItACj//2Q==",
            toPlay: cameras[0].url,
            imgSrc: null,
            imageLoaded: false
        }
    }

    captureOnClick = (event) => {
        let output = this.refs.output;
        let video = this.refs.video;
        let scale = 1;
        let canvas = document.createElement("canvas");
        let context = canvas.getContext('2d');

        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.setState({imgSrc: canvas.toDataURL()})
        this.setState({imageLoaded: true})
    }

    handleClick (state) {
        let node = this[state]
        this.setState({
          [state]: node.crop()
        })
      }

    render() {
        const style = {
            backgroundImage: `url(${this.state.backgroundImage})`,
            height: '200px'
        };

        return (
            <div style={{ background: '#ECECEC'}}>
                <div>
                    <div><header className="App-header">
                        <h2 className = "title">GETS | 慧眼示踪搜寻系统</h2>
                        <h3 className = "subtitle">God Eye Tracking System </h3>
                        <h1 className="App-title">实时监控</h1>
                        <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                    </header></div>
                    <br/>
                    <h2>选择摄像头</h2>
                    <Select defaultValue="camera1" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="camera1">摄像头1</Option>
                        <Option value="camera2">摄像头2</Option>
                        <Option value="camera3">摄像头3</Option>
                    </Select>
                    <br/><br/><br/>
                    <h2>地图</h2>
                </div>
                
                <div className="layout-container" style={style}>
                    {
                        cameras.map((camera) => {
                            return <Camera key={camera.key} x={camera.x} y={camera.y}/>
                     })
                    }
                </div>
                <br/><br/><br/>
                <h2>监控画面</h2>
                <div className="video-container">
                    <video id="video" ref="video" className="video-js vjs-default-skin" controls preload="auto" width={videoWidth} height={videoHeight} 
                    data-setup='{}'>
                        <source src={hlsServer + this.state.toPlay +".m3u8"} type="application/x-mpegURL"/>
                    </video>
                </div>
                <br/><br/><br/>
                <Button type="primary" size="large"onClick={this.captureOnClick}>截图</Button>
                <div ref="output"></div>
                <br/><br/>
                <h3>初始画面</h3>
                <Cropper src={this.state.imgSrc}
                         ref={ref => { this.image = ref }}
                         className ="initialImage"
                />
                <br/>
                {
                    this.state.imageLoaded
                    ? <Button type="primary" size="large"onClick={this.captureOnClick}>确认</Button>
                    : null
                }
                <h3>最终画面</h3>
                {
                    this.state.image
                    ? <img
                        className="after-img"
                        src={this.state.image}
                        alt=""
                    />
                    : null
                }
                <br/><br/>
            </div>
        )
    }
}export default Layout;
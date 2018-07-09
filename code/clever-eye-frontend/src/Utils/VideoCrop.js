import React, { Component } from 'react'
import {Cropper} from 'react-image-cropper'
import { Button } from 'antd'

const videoWidth = 800
const videoHeight = 400


class VideoCrop extends Component {
    constructor(props){
        super(props)
        this.state={
            imgSrc: null,
            imageLoaded: false
        }
    }

    captureOnClick = () => {
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

    cropOnClick = (state) => {
        let node = this[state]
        this.setState({
          [state]: node.crop()
        })
    }

    render(){
        const style = {
            visibility: this.props.visibility
        }
        console.log(this.props.videoUrl)

        return(
            <div style={style}>
                <h2>监控画面</h2>
                <div className="video-container">
                    <video id="video" ref="video" className="video-js vjs-default-skin" controls preload="auto" width={videoWidth} height={videoHeight} 
                    data-setup='{}'>
                        <source src={this.props.videoUrl} type={this.props.videoType}/>
                    </video>
                </div>
                <br/><br/><br/>
                <Button type="primary" size="large" onClick={this.captureOnClick}>截图</Button>
                <br/><br/>

                <h3>初始画面</h3>
                {
                    this.state.imgSrc?
                    <Cropper src={this.state.imgSrc}
                    ref={ref => { this.image = ref }}
                    className ="initialImage"
                    /> : null
                }
                <br/>
                {
                    this.state.imageLoaded
                    ? <Button type="primary" size="large" onClick={() => this.cropOnClick('image')}>确认</Button>
                    : null
                }

                <h3>最终画面</h3>
                {
                    this.state.image
                    ? 
                    <div>
                    <img
                        className="after-img"
                        src={this.state.image}
                        alt=""
                    />
                    <br/>
                    <Button type="primary" size="large" onClick={this.uploadImage}>上传</Button>
                    </div>
                    : null
                }
            </div>
        )
    }
}
export default VideoCrop
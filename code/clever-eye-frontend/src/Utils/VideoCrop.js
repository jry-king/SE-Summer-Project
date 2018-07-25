import React, { Component} from 'react'
import {Cropper} from 'react-image-cropper'
import { Button, Row, Col } from 'antd'

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

    uploadImage = () => {
        let msg = "img="+encodeURIComponent(this.state.image)
        fetch("localhost:5000/string", {
            method: 'post',
            credentials: 'include',
            body: msg
        })
    }

    render(){
        return(
            <div className='monitorImage'>
                <h2 >监控画面</h2>
                <div className="video-container" 
                    alt="snap"
                    key="media"
                    data-vjs-player>
                    <Row>
                        <Col span={3}/>
                        <Col span={12}>
                        <video
                            key={this.props.videoUrl}
                            className="video-js vjs-default-skin" controls preload="auto"
                            ref = "video"
                            poster={ this.props.poster }
                            width={videoWidth} height={videoHeight} 
                            data-setup='{}'>

                            <source src={ this.props.videoUrl } type={this.props.videoType} />

                        </video>
                        </Col>
                    </Row>
                </div>

                <br/><br/><br/>
                <Button className="crop-btn" type="primary" size="large" onClick={this.captureOnClick}>截图</Button>
                <br/><br/>
				
				<div className='initialImage'>
				{
					this.state.imgSrc?
					<div>
					<h3>初始画面</h3>
					{
						<Cropper src={this.state.imgSrc}
						ref={ref => { this.image = ref }}
						/> 
						}
					</div>
					: null
					}
				</div>
				
                <br/>
				<div>
                {
                    this.state.imageLoaded
                    ? <Button type="primary" size="large" onClick={() => this.cropOnClick('image')}>确认</Button>
                    : null
                }
				</div>
				
				<div className="after-img">
				{
					this.state.image?
					<div>
						<h3>最终画面</h3>
						{
							<div>
							<img
								src={this.state.image}
								alt=""
							/>
							<br/>
							<Button type="primary" size="large" onClick={this.uploadImage}>上传</Button>
							</div>
						}
					</div> : null
				}
				</div>
            </div>
        )
    }
}
export default VideoCrop
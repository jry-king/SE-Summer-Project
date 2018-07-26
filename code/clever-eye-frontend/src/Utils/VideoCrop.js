import React, { Component} from 'react'
import { Cropper } from 'react-image-cropper'
import { Button, Row, Col, message } from 'antd'
import { pyApi } from '../Global'

const videoWidth = 800
const videoHeight = 400


class VideoCrop extends Component {
    constructor(props){
        super(props)
        this.state={
            imgSrc: null,
            imageLoaded: false,

            resultFlag: false
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
        fetch(pyApi, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
              },
            body: msg
        })
        .then(result => result.json())
        .then(
            (result) =>{
                if (result.status){
                    message.error("ReID Error")
                    console.log(result.message)
                    return
                }
                console.log(result)
                this.setState({resultFlag: true, resultImage: "data:image/jpeg;base64,"+result.picture, filename: result.filename})
                
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
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

                            <source src={ this.props.videoUrl + ".webm" } type='video/webm; codecs="vp8, vorbis"' />
                            <source src={ this.props.videoUrl + ".mp4"} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
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
				
				<Row className="after-img">
                <Col span={3}/>
				{
					this.state.image?
					<Col span={5}>
						<h3>最终画面</h3>
						<div>
                            <img src={this.state.image} alt="crop"/>
                            <br/>
                            <Button type="primary" size="large" onClick={this.uploadImage}>上传</Button>
						</div>
					</Col> : null
                }
                {
                    this.state.resultFlag?
                    <Col span={5}>
                        <h3>搜索结果</h3>
                        <div>
                            <img src={this.state.resultImage} alt="result"/>
                            <br/>
						</div>
                    </Col>:null
                }
				</Row>
            </div>
        )
    }
}
export default VideoCrop
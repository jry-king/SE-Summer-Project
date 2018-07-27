import React, { Component} from 'react'
import { Cropper } from 'react-image-cropper'
import { Button, Row, Col, message, Radio } from 'antd'
import { pyApi } from '../Global'

const videoWidth = 800
const videoHeight = 400
const style = {
    width: 300,
    height: 300
}
const resultStyle={
    height: 300
}
const RadioGroup = Radio.Group;

class VideoCrop extends Component {
    constructor(props){
        super(props)
        this.state={
            imgSrc: null,
            imageLoaded: false,

            value: "stream",
            resultFlag: false,
        }
    }

    onChange = (e) => {
        this.setState({
            value: e.target.value
        });
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
        
        message.loading('Searching...', 0)
        
        let msg = "img="+encodeURIComponent(this.state.image)
        let uri = this.state.value
        fetch(pyApi + uri, {
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
                message.destroy()
                if (result.status){
                    message.error("ReID Error")
                    console.log(result.message)
                    return
                }

                console.log(result)
                this.setState({resultFlag: true, 
                    resultImage: "data:image/jpeg;base64,"+result.picture, 
                    filename: result.filename,
                    time: result.time
                })
                
            },
            (error) => {
                message.destroy()
                message.error("Network Error")
                console.log(error)
            }
        )

        
       /*(let image = "http://image.bee-ji.com/127579"
       this.setState({resultFlag: true, resultImage: image})
       message.destroy()*/
    }
    
    render(){
        let filename = this.state.filename
        let id
        if (this.state.resultFlag === true){
            id = filename.split('-')[0]
        }
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
                            {
                                this.props.live?
                                <source src={ this.props.videoUrl + ".m3u8"} type="application/x-mpegURL" />
                                :<source src={ this.props.videoUrl + ".mp4" } type="video/mp4" />
                            }                            
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
				
                {
                    this.state.image?
                    <table >
                    <thead>
                        <tr>
                            <th width={400}>最终画面</th>
                            <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                            {
                                this.state.resultFlag?
                                    <th width={400}>搜索结果</th>:<th width={400}/>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <img src={this.state.image} style={style} alt="crop"/>
                            </td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            {
                                this.state.resultFlag?
                                <td>
                                    <img src={this.state.resultImage} style={resultStyle} alt="result"/>
                                </td>:<td width={400}/>
                            }
                        </tr>
                        <br/>
                        <tr>
                            <td>
                                <RadioGroup onChange={this.onChange} value={this.state.value}>
                                    <Radio value="stream">Live</Radio>
                                    <Radio value="history">History</Radio>
                                </RadioGroup>
                                <Button type="primary" size="large" onClick={this.uploadImage}>上传</Button>
                            </td>
                            {
                                this.state.resultFlag?
                                <td>{'id: '+ id + '\ntime:'+this.state.time}</td>:<td/>
                            }
                        </tr>
                    </tbody>
                    </table>:null
                }
            </div>
        )
    }
}
export default VideoCrop
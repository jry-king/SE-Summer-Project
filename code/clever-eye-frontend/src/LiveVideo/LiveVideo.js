import React, { Component } from 'react';
import { dataApi, hlsServer } from '../Global';
import { Icon, Button, Select, message } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

const videoType = "application/x-mpegURL"

class LiveVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            cameras: null,
            videoUrl: null,
            map:null,

            imgSrc: null,
            imageLoaded: false
        }
        this.getMap()
        this.getCamera()
    }

    clickCamera = (cameraid) => {
        window.location.href = "/video/live/camera" + cameraid
    }

    handleClick = () => {
        window.location.href = "/video/live/" + this.state.videoUrl;
    }

    handleChange = (value) => {
        this.setState({videoUrl:value})
    }

    getCamera = () => {
        fetch(dataApi + "camera?areaid=1",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else
                    this.setState({
                        cameras: result,
                        videoUrl: result[0].url
                    })
            },
            (error) => {
                message.error("error")
                console.log(error)
            }
        )
    }

    getMap = () => {
        fetch(dataApi + "map?areaid=1",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else
                    this.setState({
                        map: result.map
                    })
            },
            (error) => {
                message.error("error")
                console.log(error)
            }
        )
    }

    render() {
        const cameras = this.state.cameras
        const camera = this.props.match.params.camera
        const videoUrl = hlsServer + camera + ".m3u8"
        const map = this.state.map
        console.log(camera)
        return (
            <div className="big-container" style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="实时监控"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>
                {
                    camera?<VideoCrop className='liveVideo'  videoUrl={videoUrl} videoType={videoType}/>:
                    (
                        cameras?
                        <div>
                            <div className="select-container">
                                <h2>选择摄像头</h2>
                                <Select defaultValue={camera} style={{ width: 120 }} onChange={this.handleChange}>
                                {
                                    cameras.map((camera) => {
                                        return <Option key={camera.cameraid} id={camera.cameraid} value={"camera"+camera.cameraid}>{"摄像头"+camera.cameraid}</Option>
                                    })
                                }
                                </Select>
                                <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                                <br/><br/><br/>
                            </div>

                            <Map cameras={cameras} backgroundImage={map} clickCamera={this.clickCamera} chosenCamera={camera}/>
                        </div>
                        :null
                    )
                }
                
                <br/><br/>
            </div>
        )
    }
}export default LiveVideo;
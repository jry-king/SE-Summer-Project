import React, { Component } from 'react';
import { dataApi, hlsServer } from '../Global';
import { Icon, Button, Select, message, Row, Col } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

const videoType = "application/x-mpegURL"

class LiveVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            chosenCamera: null,

            imgSrc: null,
            imageLoaded: false
        }
    }

    componentDidMount = () => {
        this.getMap()
        this.getCamera()
    }

    clickCamera = (cameraid) => {
        this.setState({chosenCamera:"camera"+cameraid})
    }

    handleClick = () => {
        window.location.href = "/video/live/" + this.state.chosenCamera;
    }

    handleChange = (value) => {
        this.setState({chosenCamera:value})
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
                        chosenCamera: "camera" + result[0].cameraid
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
                message.error("Network Error")
                console.log(error)
            }
        )
    }

    render() {
        const cameras = this.state.cameras
        const camera = this.props.match.params.camera
        const videoUrl = hlsServer + camera + ".m3u8"
        const map = this.state.map
        const chosenCamera = this.state.chosenCamera
        return (
            <div style={{ background: '#ECECEC'}}>
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
                            <Row>
                                <Col span={8}/>
                                <Col span={3}><h2>选择摄像头:</h2></Col>
                                <Col span={3}>
                                    <Select value={chosenCamera} style={{ width: 120 }} onChange={this.handleChange}>
                                    {
                                        cameras.map((camera) => {
                                            return <Option key={camera.cameraid} id={camera.cameraid} value={"camera"+camera.cameraid}>{"camera"+camera.cameraid}</Option>
                                        })
                                    }
                                    </Select>
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                                </Col>
                            </Row>
                            <br/><br/><br/>
                            <Map cameras={cameras} backgroundImage={map} clickCamera={this.clickCamera} chosenCamera={chosenCamera}/>
                        </div>
                        :null
                    )
                }
                
                <br/><br/>
            </div>
        )
    }
}export default LiveVideo;
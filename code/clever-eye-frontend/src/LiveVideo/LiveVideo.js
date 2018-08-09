import React, { Component } from 'react';
import { dataApi, hlsServer } from '../Global';
import { Icon, Button, Select, message, Row, Col } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

class LiveVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            chosenCamera: null,
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

    handleChangeArea = (value) => {
        this.setState({chosenArea:value})
    }

    handleChangeCamera = (value) => {
        this.setState({chosenCamera:value})
    }

    getCamera = () => {
        fetch(dataApi + "camera/all",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else{
                    let idArray = []
                    let array = {}
                    for (let i in result){
                        let a = result[i].areaid
                        if (idArray.indexOf(a) === -1 ){
                            idArray.push(a)
                            array[a] = []
                            array[a].push(result[i])
                        }
                        else{
                            array[a].push(result[i])
                        }
                    }
                    this.setState({
                        cameras: array,
                        idArray: idArray,
                        chosenArea: idArray[0]
                    })
                }
            },
            (error) => {
                message.error("error")
                console.log(error)
            }
        )
    }

    /*
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
    }*/

    getMap = () => {
        fetch(dataApi + "map/all",{
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
                        maps: result
                    })
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
    }

    chosenMap = (maps, areaid) => {
        for (let i in maps){
            if (maps[i].areaid === areaid)
                return maps[i].map
        }
        return null
    }

    render() {
        const camera = this.props.match.params.camera
        const videoUrl = hlsServer + camera
        const chosenCamera = this.state.chosenCamera
        const chosenArea = this.state.chosenArea
        const map = this.chosenMap(this.state.maps, chosenArea)
        const idArray = this.state.idArray
        const cameras = this.state.cameras

        console.log(chosenArea)
        console.log(cameras)
        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="实时监控"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>
                {
                    camera?<VideoCrop className='liveVideo'  videoUrl={videoUrl} live={true}/>:
                    (
                        cameras?
                        <div>
                            <Row>
                                <Col span={8}/>
                                <Col span={3}><h2>选择区域:</h2></Col>
                                <Col span={3}>
                                    <Select value={chosenArea} style={{ width: 120 }} onChange={this.handleChangeArea} name="chosenArea">
                                    {
                                        idArray.map((id) => {
                                            return <Option key={id} id={id} value={id}>{id}</Option>
                                        })
                                    }
                                    </Select>
                                </Col>
                                <Col span={2}/>
                            </Row>
                            {
                                chosenArea?<Row>
                                    <Col span={8}/>
                                    <Col span={3}><h2>选择摄像头:</h2></Col>
                                    <Col span={3}>
                                        <Select value={chosenCamera} style={{ width: 120 }} onChange={this.handleChangeCamera} name="chosenCamera">
                                        {
                                            cameras[chosenArea].map((camera) => {
                                                return <Option key={camera.cameraid} id={camera.cameraid} value={"camera"+camera.cameraid}>{"camera"+camera.cameraid}</Option>
                                            })
                                        }
                                        </Select>
                                    </Col>
                                    <Col span={2}>
                                        <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                                    </Col>
                                </Row>:null
                            }
                            <br/><br/><br/>
                            <Map cameras={cameras[chosenArea]} backgroundImage={map} clickCamera={this.clickCamera} chosenCamera={chosenCamera}/>
                        </div>
                        :null
                    )
                }
                
                <br/><br/>
            </div>
        )
    }
}export default LiveVideo;
import React, {Component} from 'react'
import { dataApi, videoServer} from '../Global';
import { Icon, Button, Select, message, Row, Col } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

const videoType = "video/webm"

class HistoryVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            videoUrl:null,
            chosenCamera: null,
            chosenHistory: null,
            
            imgSrc: null,
            imageLoaded: false
        }
    }

    componentDidMount = () => {
        this.getMap()
        this.getCamera()
        this.getHistory()
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
                else{
                    this.setState({
                        cameras: result,
                        chosenCamera: "camera" + result[0].cameraid,
                    })
                }
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

    getHistory = () => {
        fetch(dataApi + "history?areaid=1",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else{
                    this.setState({
                        history: result
                    })
                }
            },
            (error) => {
                message.error("error")
                console.log(error)
            }
        )
    }

    clickCamera = (cameraid) => {
        this.setState({chosenCamera:"camera"+cameraid})
        this.setState({chosenHistory: this.getChosenHistory(cameraid, this.state.history)})
    }

    handleClick = () => {
        window.location.href = "/video/history/"+encodeURIComponent(this.state.videoUrl);
    }

    handleChangeCamera = (value) => {
        this.setState({chosenCamera:"camera"+value})
        console.log(value)
        console.log(this.state.history)
        this.setState({chosenHistory: this.getChosenHistory(value, this.state.history)})
    }
	
	handleChangeFragment = (value) => {
        this.setState({videoUrl: this.state.chosenCamera + "/" + value})
    }

    getChosenHistory = (cameraid, history) => {
        let result = []
        for (let i in history){
            if (history[i].cameraid === cameraid)
                result.push(history[i])
        }
        return result
    }

    render() {
        const file = this.props.match.params.file

        const videoUrl = videoServer + decodeURIComponent(file) + ".webm"
        const history = this.state.chosenHistory
        const cameras = this.state.cameras
        const map = this.state.map

        const chosenCamera = file?file.split('/')[0]:this.state.chosenCamera

        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="历史视频"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>
                {
                    file?<VideoCrop className="videoCrop" videoUrl={videoUrl} videoType={videoType}/>:
                    (
                        cameras?
                        <div>
                            <Row>
                                <Col span={8}/>
                                <Col span={3}><h2>选择摄像头</h2></Col>
                                <Col span={3}>
                                    <Select default={chosenCamera} style={{ width: 120 }} onChange={this.handleChangeCamera}>
                                    {
                                        cameras.map((camera) => {
                                            return <Option key={camera.cameraid} id={camera.cameraid} value={camera.cameraid}>{"摄像头"+camera.cameraid}</Option>
                                        })
                                    }
                                    </Select>
                                </Col>
                            </Row>
                                {
                                    history?
                                    <Row>
                                        <Col span={8}/>
                                        <Col span={3}><h2>选择视频片段</h2></Col>
                                        <Col span={3}>
                                            <Select style={{ width: 120 }} onChange={this.handleChangeFragment}>
                                            {
                                                history.map((h) => {
                                                    return <Option key={h.historyid} id={h.historyid} value={h.filename}>{h.filename}</Option>
                                                })
                                            }
                                            </Select>
                                        </Col>
                                        <Col span={3}>
                                            <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                                        </Col>
                                    </Row>
                                    :null
                                }
                            <Map cameras={cameras} backgroundImage={map} clickCamera={this.clickCamera} chosenCamera={chosenCamera}/>
                        </div>
                        :null
                    )
                }
                
                <br/><br/>
            </div>
        )
    }
}
export default HistoryVideo
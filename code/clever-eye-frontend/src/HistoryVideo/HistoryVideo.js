import React, {Component} from 'react'
import { cameraApi, mapApi, historyApi, videoApi} from '../Global';
import { Icon, Button, Select, message, Row, Col } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

class HistoryVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            videoUrl:null
            /*
                cameraidArray
                areaidArray
                
                cameras
                history
                maps

                chosenArea
                chosenCamera
                chosenHistory
            */
        }
    }

    componentDidMount = () => {
        this.getMap()
        this.getCamera()
        this.getHistory()
    }

    getCamera = () => {
        fetch(cameraApi.getAllCamera, {
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else{
                    let areaidArray = []
                    let array = {}
                    for (let i in result){
                        let a = result[i].areaid
                        if (areaidArray.indexOf(a) === -1 ){
                            areaidArray.push(a)
                            array[a] = []
                            array[a].push(result[i])
                        }
                        else{
                            array[a].push(result[i])
                        }
                    }
                    this.setState({
                        cameras: array,
                        areaidArray: areaidArray,
                        chosenArea: areaidArray[0]
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
        fetch(mapApi.getAllMap ,{
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

    getHistory = () => {
        fetch(historyApi.getHistoryByAreaid + "/1",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else{
                    let areaidArray = []
                    let cameraidArray = []
                    let array = {}
                    for (let i in result){
                        let a = result[i].areaid
                        let c = result[i].cameraid
                        if (areaidArray.indexOf(a) === -1){
                            areaidArray.push(a)
                            array[a] = {}
                        }
                        if (cameraidArray.indexOf(c) === -1){
                            cameraidArray.push(c)
                            array[a][c] = [] 
                        }
                        array[a][c].push(result[i])
                    }
                    this.setState({
                        history: array
                    })
                }
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
    }

    clickCamera = (cameraid) => {
        let temp = this.state.history[this.state.chosenArea]
        this.setState({
            chosenCamera: "camera"+cameraid,
            chosenHistory: null
        })
        if ((temp===null)||(typeof(temp)==='undefined')){
            message.warning("No history data")
            this.setState({
                targetHistory: null
            })
            return
        }
        this.setState({
            targetHistory: this.state.history[this.state.chosenArea][cameraid],
        })

    }

    handleClick = () => {
        if (this.state.chosenHistory===null){
            message.error("Error")
            return
        }
        window.location.href = 
            "/video/history/"+
            encodeURIComponent(this.state.chosenCamera + "/" + this.state.chosenHistory);
    }

    handleChangeArea = (value) => {
        this.setState({
            chosenArea:value,
            chosenCamera:null,
            targetHistory:null,
            chosenHistory: null
        })
    }

    handleChangeCamera = (cameraid) => {
        let temp = this.state.history[this.state.chosenArea]
        this.setState({
            chosenCamera:"camera"+cameraid,
            chosenHistory: null
        })
        if ((temp===null)||(typeof(temp)==='undefined')){
            message.warning("No history data")
            this.setState({
                targetHistory: null
            })
            return
        }
        this.setState({
            targetHistory: temp[cameraid]
        })
    }
	
	handleChangeHistory = (value) => {
        this.setState({
            chosenHistory: value
        })
    }

    getTargetHistory = (cameraid, history) => {
        let result = []
        for (let i in history){
            if (history[i].cameraid === cameraid)
                result.push(history[i])
        }
        return result
    }

    chosenMap = (maps, areaid) => {
        for (let i in maps){
            if (maps[i].areaid === areaid)
                return maps[i].map
        }
        return null
    }

    render() {
        const file = this.props.match.params.file

        const videoUrl = videoApi.videoServer + decodeURIComponent(file)
        const history = this.state.targetHistory

        /* all cameras data  */
        /* divided by areaid */
        /* 
        e.g.              
        { 
            '1': [...cameras], 
            '2': [...cameras]
        }                
        */
        const cameras = this.state.cameras
        const chosenArea = this.state.chosenArea
        const map = this.chosenMap(this.state.maps, chosenArea)


        /* list of areaid */
        const areaidArray = this.state.areaidArray

        const chosenCamera = file?file.split('/')[0]:this.state.chosenCamera

        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="历史视频"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>
                {
                    file?<VideoCrop className="videoCrop" videoUrl={videoUrl} live={false}/>:
                    (
                        cameras?
                        <div>
                            <Row>
                                <Col span={8}/>
                                <Col span={3}><h2>选择区域:</h2></Col>
                                <Col span={3}>
                                    <Select value={chosenArea} style={{ width: 120 }} onChange={this.handleChangeArea} name="chosenArea">
                                    {
                                        areaidArray.map((id) => {
                                            return <Option key={id} id={id} value={id}>{id}</Option>
                                        })
                                    }
                                    </Select>
                                </Col>
                                <Col span={2}/>
                            </Row>
                            {
                                chosenArea 
                                && (cameras[chosenArea]!==null) 
                                && (typeof(cameras[chosenArea])!=='undefined')?
                                <div>
                                    <Row>
                                        <Col span={8}/>
                                        <Col span={3}><h2>选择摄像头</h2></Col>
                                        <Col span={3}>
                                            <Select value={chosenCamera} style={{ width: 120 }} onChange={this.handleChangeCamera}>
                                            {
                                                cameras[chosenArea].map((camera) => {
                                                    return <Option key={camera.cameraid} id={camera.cameraid} value={camera.cameraid}>{"camera"+camera.cameraid}</Option>
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
                                                <Select value={this.state.chosenHistory} style={{ width: 120 }} onChange={this.handleChangeHistory}>
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
                                </div>:message.warning("No camera data")
                            }
                            <Map cameras={cameras[chosenArea]} backgroundImage={map} clickCamera={this.clickCamera} chosenCamera={chosenCamera}/>
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
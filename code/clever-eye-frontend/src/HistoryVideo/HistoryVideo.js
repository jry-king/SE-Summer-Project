import React, {Component} from 'react'
import { dataApi, videoServer} from '../Global';
import { Icon, Button, Select, message } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

const cameras = [{key:1, x:'10%', y:'10%',param1:'param1', param2:'param2', param3:'param3', url:'camera1',area:1}, {key:2, x:'30%',y:'30%',param1:'param1', param2:'param2', param3:'param3',url:'camera2',area:1}]
const backgroundImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAAAQIDBv/EABgQAQEBAQEAAAAAAAAAAAAAAAABAhEh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEGBf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOhkaSDMXI7jKlIrhyKkRUcHGnCsBnYixtYmxUYagXqeAFZjSRGWkRTkPhw+AQ4fAKmxFjRNgjKwHo1QstIzy0iKo0wxVFR0dQJNUmqiNAaCojNaSsM6XNA3lNlNKmkVYT0ugrqbU3SboBqhnrQVGeWmaAC5T6AA6OgAVqbSAItACj//2Q=="

const history = [{id:1, key:1, file:"test"},{id:2, key:1, file:"test2"},{id:3, key:2, file:"test3"}]
const videoType = "video/webm"

class HistoryVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            videoUrl: null,
            cameras: cameras,

            cameraChosen: "camera1",
            chosenHistory: this.getChosenHistory(1),
            
            imgSrc: null,
            imageLoaded: false
        }
    }

    handleClick = () => {
        window.location.href = "/video/history/"+encodeURIComponent(this.state.videoUrl);
    }

    handleChangeCamera = (value) => {
        this.setState({cameraChosen:"camera"+value})
        this.setState({chosenHistory: this.getChosenHistory(value)})
    }
	
	handleChangeFragment = (value) => {
        this.setState({videoUrl: this.state.cameraChosen + "/" + value})
    }

    getChosenHistory = (key) => {
        let result = []
        for (let i in history){
            if (history[i].key === key)
                result.push(history[i])
        }
        return result
    }

    getCamera = () => {
        fetch(dataApi + "/camera?all=false&area=1",{
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
                message.error(error)
            }
        )
    }

    render() {
        const file = this.props.match.params.file
        const videoUrl = videoServer + decodeURIComponent(file) + ".webm"
        const history = this.state.chosenHistory

        console.log(history)
        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="历史视频"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>

                
                <div className="select-container">
                    <h2>选择摄像头</h2>
                    <Select defaultValue="camera1" style={{ width: 120 }} onChange={this.handleChangeCamera}>
                    {
                        cameras.map((camera) => {
                            return <Option key={camera.key} id={camera.key} value={camera.key}>{"摄像头"+camera.key}</Option>
                        })
                    }
                    </Select>

                    <br/><br/><br/>
                </div>
				
				<div>
                    {
                        history?
                        <div className="select-container">
                            <h2>选择视频片段</h2>
                            <Select defaultActiveFirstOption={true} style={{ width: 120 }} onChange={this.handleChangeFragment}>
                            {
                                history.map((h) => {
                                    return <Option key={h.key} id={h.key} value={h.file}>{h.file}</Option>
                                })
                            }
                            </Select>
                            <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                            <br/><br/><br/>
                        </div>:<div>"No history available"</div>
                    }
				</div>

                <Map cameras={cameras} backgroundImage={backgroundImage}/>

                <br/><br/><br/>
                {
                    file?<VideoCrop videoUrl={videoUrl} videoType={videoType}/>:null
                }
                
                <br/><br/>
            </div>
        )
    }
}
export default HistoryVideo
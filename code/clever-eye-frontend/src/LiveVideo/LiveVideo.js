import React, { Component } from 'react';
import { dataApi, hlsServer } from '../Global';
import { Icon, Button, Select, message } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

const cameras = [{key:1, x:'10%', y:'10%',param1:'param1', param2:'param2', param3:'param3', url:'camera1',area:1}, {key:2, x:'30%',y:'30%',param1:'param1', param2:'param2', param3:'param3',url:'camera2',area:1}]
const backgroundImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAAAQIDBv/EABgQAQEBAQEAAAAAAAAAAAAAAAABAhEh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEGBf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOhkaSDMXI7jKlIrhyKkRUcHGnCsBnYixtYmxUYagXqeAFZjSRGWkRTkPhw+AQ4fAKmxFjRNgjKwHo1QstIzy0iKo0wxVFR0dQJNUmqiNAaCojNaSsM6XNA3lNlNKmkVYT0ugrqbU3SboBqhnrQVGeWmaAC5T6AA6OgAVqbSAItACj//2Q=="
const videoType = "application/x-mpegURL"

class LiveVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            cameras: cameras,
            videoUrl: cameras[0].url,

            imgSrc: null,
            imageLoaded: false
        }
    }

    handleClick = () => {
        window.location.href = "/video/live/"+this.state.videoUrl;
    }

    handleChange = (value) => {
        this.setState({videoUrl:value})
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
        const camera = this.props.match.params.camera
        const videoUrl = hlsServer + camera + ".m3u8"
        console.log(camera)
        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="实时监控"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>

                
                <div className="select-container">
                    <h2>选择摄像头</h2>
                    <Select defaultValue={camera} style={{ width: 120 }} onChange={this.handleChange}>
                    {
                        cameras.map((camera) => {
                            return <Option key={camera.key} id={camera.key} value={camera.url}>{"摄像头"+camera.key}</Option>
                        })
                    }
                    </Select>
                    <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                    <br/><br/><br/>
                </div>

                <Map cameras={cameras} backgroundImage={backgroundImage}/>

                <br/><br/><br/>
                {
                    camera?
					<div>
						<VideoCrop  videoUrl={videoUrl} videoType={videoType}/>
					</div>:null
                }
                
                <br/><br/>
            </div>
        )
    }
}export default LiveVideo;
import React, { Component } from 'react';
import Camera from './Camera'
import { Select } from 'antd';

const cameras = [{key:1, x:'10%', y:'10%'}, {key:2, x:'30%',y:'30%'}]

const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

class Layout extends Component {

    constructor(props){
        super(props)
        this.state={
            backgroundImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAAAQIDBv/EABgQAQEBAQEAAAAAAAAAAAAAAAABAhEh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEGBf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOhkaSDMXI7jKlIrhyKkRUcHGnCsBnYixtYmxUYagXqeAFZjSRGWkRTkPhw+AQ4fAKmxFjRNgjKwHo1QstIzy0iKo0wxVFR0dQJNUmqiNAaCojNaSsM6XNA3lNlNKmkVYT0ugrqbU3SboBqhnrQVGeWmaAC5T6AA6OgAVqbSAItACj//2Q==",
        }
    }

    render() {
        const style = {
            backgroundImage: `url(${this.state.backgroundImage})`,
            height: '200px'
          };
        return (
            <div>
                <div>
                <h2 className = "title">实时查询</h2>
                    <Select defaultValue="camera1" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="camera1">摄像头1</Option>
                        <Option value="camera2">摄像头2</Option>
                        <Option value="camera3">摄像头3</Option>
                    </Select>
                </div>

                <div className="layout-container" style={style}>
                {
                    cameras.map((camera) => {
                        return <Camera key={camera.key} x={camera.x} y={camera.y}/>
                    })
                }
                </div>
            </div>
        )
    }
}export default Layout;
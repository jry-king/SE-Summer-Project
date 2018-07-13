import React, { Component } from 'react';
import { Popover, Icon } from 'antd';

class Camera extends Component{

    render(){
        const camera = this.props.camera
        const content = (<div>
                <p>{'param1:' + camera.param1 }</p>
                <p>{'param2:' + camera.param2 }</p>
                <p>{'param3:' + camera.param3 }</p>
            </div>)
        
        const x = camera.x
        const y = camera.y

        const minusX = '-'+x
        const minusY = '-'+y

        const styles = (this.props.chosen===true)?{
            top: x,
            left: y,
            transform: `translate(${minusX}, ${minusY})`,
            borderStyle: `solid`,
            borderColor: `red`,
            borderRadius: `5px`
        }:{
            top: x,
            left: y,
            transform: `translate(${minusX}, ${minusY})`,
        }

        const circle = {
            top: x,
            left: y,
            transform: `translate(${minusX}, ${minusY})`,
            width:`100px`,
            height:`100px`,
            border:`5px solid orange`,
            borderRadius:`50px`
        }

        const cameraid = camera.cameraid
            
        return(
            <div className="camera">
                <Popover content={content} title={"Camera"+cameraid} trigger="hover">
                    <Icon className='btn' style={styles} type="video-camera" onClick={(e) => this.props.clickCamera(cameraid)}/>
                </Popover>
            </div>
        )
    }
}export default Camera
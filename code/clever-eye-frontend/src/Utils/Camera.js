import React, { Component } from 'react';
import { Popover, Icon } from 'antd';

class Camera extends Component{

    render(){
        const camera = this.props.camera
        const
        const content = (<div>
                <p>{'param1:' + camera.param1 }</p>
                <p>{'param2:' + camera.param2 }</p>
                <p>{'param3:' + camera.param3 }</p>
            </div>)
        
        const x = camera.x
        const y = camera.y

        const minusX = '-'+x
        const minusY = '-'+y

        const styles = {
            top: x,
            left: y,
            transform: `translate(${minusX}, ${minusY})`,
        }

        return(
            <div className="camera">
                <Popover content={content} title={"Camera"+camera.key} trigger="hover">
                    <Icon className='btn' style={styles} type="video-camera" />
                </Popover>
            </div>
        )
    }
}export default Camera
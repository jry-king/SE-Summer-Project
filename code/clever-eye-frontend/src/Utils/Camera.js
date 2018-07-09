import React, { Component } from 'react';
import { Popover, Icon } from 'antd';

class Camera extends Component{

    render(){
        const content = (<div>
                <p>{'param1:' + this.props.param1 }</p>
                <p>{'param2:' + this.props.param2 }</p>
                <p>{'param3:' + this.props.param3 }</p>
            </div>)
        
        const x = this.props.x
        const y = this.props.y

        const minusX = '-'+x
        const minusY = '-'+y

        const styles = {
            top: x,
            left: y,
            transform: `translate(${minusX}, ${minusY})`,
        }

        return(
            <div className="camera">
                <Popover content={content} title={"Camera"+this.props.id} trigger="hover">
                    <Icon className='btn' style={styles} type="video-camera" />
                </Popover>
            </div>
        )
    }
}export default Camera
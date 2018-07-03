import React, { Component } from 'react';
import { Popover, Icon } from 'antd';

class Camera extends Component{
    constructor(props){
        super(props);
        this.state = {
            param1: 1,
            param2: 2,
            param3: 3,
            x: this.props.x,
            y: this.props.y
        }
    }

    render(){
        const content = (<div>
                <p>{'param1:' + this.state.param1 }</p>
                <p>{'param2:' + this.state.param2 }</p>
                <p>{'param3:' + this.state.param3 }</p>
            </div>)
        
        const x = this.state.x
        const y = this.state.y

        const minusX = '-'+x
        const minusY = '-'+y

        const styles = {
            top: x,
            left: y,
            transform: `translate(${minusX}, ${minusY})`,
        }

        console.log("x:"+x)
        console.log("y:"+y)
        console.log('-x:'+minusX)
        console.log('-y:'+minusY)

        return(
            <div className="camera">
                <Popover content={content} title="Parameters" trigger="hover">
                    <Icon className='btn' style={styles} type="video-camera" />
                </Popover>
            </div>
        )
    }
}export default Camera
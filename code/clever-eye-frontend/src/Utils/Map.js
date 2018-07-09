import React, {Component} from 'react'
import Camera from './Camera'

class Map extends Component{

    render(){
        const style = {
            backgroundImage: `url(${this.props.backgroundImage})`,
            height: '200px'
        };
        const cameras = this.props.cameras

        return(
            <div>
                <h2>地图</h2>
                <div className="layout-container" style={style}>
                    {
                        cameras.map((camera) => {
                            return <Camera key={camera.key} x={camera.x} y={camera.y}/>
                     })
                    }
                </div>
            </div>
        );
    }
}
export default Map
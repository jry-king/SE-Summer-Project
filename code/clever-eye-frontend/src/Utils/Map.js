import React, {Component} from 'react'
import Camera from './Camera'

class Map extends Component{

    render(){
        const style = {
            backgroundImage: `url(${this.props.backgroundImage})`,
        };
        const cameras = this.props.cameras

        return(
            <div>
                <h2>地图</h2>
                <div className="layout-container" style={style}>
                    {
                        cameras.map((camera) => {
                            if ("camera" + camera.cameraid === this.props.chosenCamera)
                                return <Camera key={camera.cameraid} camera={camera} clickCamera={this.props.clickCamera} chosen={true}/>
                            return <Camera key={camera.cameraid} camera={camera} clickCamera={this.props.clickCamera} chosen={false}/>
                        
                     })
                    }
                </div>
            </div>
        );
    }
}
export default Map
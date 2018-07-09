import React, {Component} from 'react'

const cameras = [{key:1, x:'10%', y:'10%', url:'camera1',area:1}, {key:2, x:'30%',y:'30%',url:'camera2',area:1}]

class CameraTable extends Component{
    constructor(props){
        super(props)
        this.state={
            cameras:cameras,
        }
    }

    getCamera = () => {
        fetch(dataApi + "/camera?all=true",{
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

    deleteCamera = (key) => {
        fetch(dataApi + "/camera/delete?key=" + key,{
            method:'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else{
                    message.success("Delete Success")
                    this.setState({cameras:result})
                }
            },
            (error) => {
                message.error("Delete Book Error:\n"+error)
            }
        )
    }


    render(){
        const cameras = this.state.cameras
        return(
            <table>
                <th>
                    <tr>Key</tr>
                    <tr>Param1</tr>
                    <tr>Param2</tr>
                    <tr>Param3</tr>
                    <tr>Area</tr>
                    <tr>Position X</tr>
                    <tr>Position Y</tr>
                    <tr>Action</tr>
                    <tr/>
                </th>
                <tbody>
                    {
                        cameras.map((camera) => {
                            <CameraRow key={camera.key} camera={camera}/>
                        })
                    }
                </tbody>
            </table>
        )
    }
}
export default CameraTable
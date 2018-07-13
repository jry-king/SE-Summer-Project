import React, {Component} from 'react'
import CameraRow from './CameraRow'
import { dataApi } from '../Global'
import { message } from 'antd'

class CameraTable extends Component{
    constructor(props){
        super(props)

        this.state={
            cameras:null,
        }
        this.getCamera()
    }

    getCamera = () => {
        fetch(dataApi + "camera/all",{
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
        fetch(dataApi + "camera/delete?key=" + key,{
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
            <table className='managementTable'>
                <thead>
                    <tr>
                    <th>Cameraid</th>
                    <th>Param1</th>
                    <th>Param2</th>
                    <th>Param3</th>
                    <th>Area</th>
                    <th>Position X</th>
                    <th>Position Y</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        cameras?cameras.map((camera) => {
                            return (
                                <CameraRow key={camera.key} camera={camera}/>
                            )
                        }):null
                    }
                </tbody>
            </table>
        )
    }
}
export default CameraTable
import React, {Component} from 'react'
import { dataApi } from '../Global'
import { message, Button, Input } from 'antd'


class CameraRow extends Component{
    constructor(props){
        super(props)
        this.state={
            key: this.props.camera.cameraid,
            param1: this.props.camera.param1,
            param2: this.props.camera.param2,
            param3: this.props.camera.param3,
            areaid: this.props.camera.areaid,
            x: this.props.camera.x,
            y: this.props.camera.y,
            edit: false,

            old_param1: this.props.camera.param1,
            old_param2: this.props.camera.param2,
            old_param3: this.props.camera.param3,
            old_areaid: this.props.camera.areaid,
            old_x: this.props.camera.x,
            old_y: this.props.camera.y,
        }
    }

    handleDelete = () => {
        this.props.deleteCamera(this.props.camera.cameraid)
    }

    handleEdit = () => {
        this.setState({
            old_param1:this.state.param1, 
            old_param2:this.state.param2, 
            old_param3:this.state.param3,
            edit:true    
        })
    }

    handleChange = (e) =>{
        this.setState({[e.target.name]:e.target.value})
    }

    handleCancel = () =>{
        this.setState({
            param1: this.state.old_param1,
            param2: this.state.old_param2,
            param3: this.state.old_param3,
            areaid: this.state.old_areaid,
            x: this.state.old_x,
            y: this.state.old_y,
            edit: false
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (
            this.state.param1!=="" &&
            this.state.param2!=="" &&
            this.state.param3!=="" &&
            this.state.areaid!=="" &&
            this.state.x!=="" &&
            this.state.y!==""
        ){
            let msg = {
                "cameraid":encodeURIComponent(this.state.cameraid),
                "param1":encodeURIComponent(this.state.param1),
                "param2":encodeURIComponent(this.state.param2),
                "param3":+encodeURIComponent(this.state.param3),
                "x":+encodeURIComponent(this.state.x),
                "y":encodeURIComponent(this.state.y),
                "areaid":+encodeURIComponent(this.state.areaid)
            }

            fetch(dataApi+"camera/save", {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: msg

            })
            .then(res => res.json())
            .then(
                (result)=>{
                    if (result.status)
                        message.error("Edit Error:\n"+result.msg)
                    else {
                        message.success("Edit Success")
                        this.setState({edit:false})
                    }
                },
                (error) => {
                    message.error("Edit Error:\n"+error)
                }
            )
        }
        else
            message.error("Parameters Cannot Be Empty")
    }

    render(){
        let key = this.state.key
        let param1 = this.state.param1
        let param2 = this.state.param2
        let param3 = this.state.param3
        let areaid = this.state.areaid
        let x = this.state.x
        let y = this.state.y
        let edit = this.state.edit
        if (!edit){
            return(
                <tr>
                    <td>{key}</td>
                    <td>{param1}</td>
                    <td>{param2}</td>
                    <td>{param3}</td>
                    <td>{areaid}</td>
                    <td>{x}</td>
                    <td>{y}</td>
                    <td><Button type="primary" onClick={this.handleEdit}>Edit</Button></td>
                    <td><Button type="danger" onClick={this.handleDelete}>Delete</Button></td>
                </tr>
            )
        }
        else{
            return (
                <tr>
                    <td>{key}</td>
                    <td>
                    <Input type="text" defaultValue={param1} placeholder="Param1" onChange={this.handleChange} name="param1"/>
                    </td>
                    <td>
                    <Input type="text" defaultValue={param2} placeholder="Param2" onChange={this.handleChange} name="param2"/>
                    </td>
                    <td>
                    <Input type="text" defaultValue={param3} placeholder="Param1" onChange={this.handleChange} name="param3"/>
                    </td>
                    <td>
                    <Input type="text" defaultValue={areaid} placeholder="areaid" onChange={this.handleChange} name="areaid"/>
                    </td>
                    <td>
                    <Input type="text" defaultValue={x} placeholder="Postion X" onChange={this.handleChange} name="x"/>
                    </td>
                    <td>
                    <Input type="text" defaultValue={y} placeholder="Postion Y" onChange={this.handleChange} name="y"/>
                    </td>
                    <td className = 'action'>
                        <Button color="primary" onClick = {this.handleSubmit}>Submit</Button>
                    </td>
                    <td className = 'action'>
                        <Button color="primary" onClick = {this.handleCancel}>Cancel</Button>
                    </td>
                </tr>
            )
        }
    }

}
export default CameraRow
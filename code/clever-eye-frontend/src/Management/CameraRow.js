import React, {Component} from 'react'
import { dataApi } from '../Global'
import { message, Button } from 'antd'


class CameraRow extends Component{
    constructor(props){
        super(props)
        this.state={
            key: this.props.camera.key,
            param1: this.props.camera.param1,
            param2: this.props.camera.param2,
            param3: this.props.camera.param3,
            area: this.props.camera.area,
            x: this.props.camera.x,
            y: this.props.camera.y,
            edit: false,

            old_param1: this.props.camera.param1,
            old_param2: this.props.camera.param2,
            old_param3: this.props.camera.param3,
            old_area: this.props.camera.area,
            old_x: this.props.camera.x,
            old_y: this.props.camera.y,
        }
    }

    handleDelete = () => {
        this.props.deleteCamera(this.props.camera.key)
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
            area: this.state.old_area,
            x: this.state.old_x,
            y: this.state. old_y,
            edit: false
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (
            this.state.param1!=="" &&
            this.state.param2!=="" &&
            this.state.param3!=="" &&
            this.state.area!=="" &&
            this.state.x!=="" &&
            this.state.y!==""
        ){
            let msg = "param1="+encodeURIComponent(this.state.param1)+
            "&param2"+encodeURIComponent(this.state.param2)+
            "&param3"+encodeURIComponent(this.state.param3)

            fetch(dataApi+"/camera/save?"+msg, {
                method: 'get',
                credentials: 'include',
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
        let area = this.state.area
        let x = this.state.x
        let y = this.state.y
        if (!edit){
            return(
                <tr>
                    <td>{key}</td>
                    <td>{param1}</td>
                    <td>{param2}</td>
                    <td>{param3}</td>
                    <td>{area}</td>
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
                    <Input type="text" defaultValue={area} placeholder="Area" onChange={this.handleChange} name="area"/>
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
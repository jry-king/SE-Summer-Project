import React, {Component} from 'react'
import { Button, Input, message} from 'antd'
import { dataApi } from '../Global'

class MapRow extends Component {
    constructor(props){
        super(props)
        this.state={
            mapid: this.props.map.mapid,
            map: this.props.map.map,
            areaid: this.props.map.areaid,
            edit: false,

            old_map: this.props.map.map,
            old_areaid: this.props.map.areaid
        }
    }
    handleDelete = () => {
        this.props.deleteMap(this.props.map.mapid)
    }

    handleEdit = () => {
        this.setState({
            old_map:this.state.map, 
            old_areaid:this.state.areaid, 
            edit:true    
        })
    }

    handleChange = (e) =>{
        this.setState({[e.target.name]:e.target.value})
    }

    handleCancel = () =>{
        this.setState({
            map: this.state.old_map,
            areaid: this.state.areaid,
            edit: false
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.map!=="" &&this.state.areaid!=="" ) {
            let msg = {
                "mapid":encodeURIComponent(this.state.mapid),
                "map":encodeURIComponent(this.state.map),
                "areaid":encodeURIComponent(this.state.areaid)
            }

            fetch(dataApi+"map/save", {
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
                    message.error("Network Error")
                    console.log(error)
                }
            )
        }
    }

    render(){
        let mapid = this.state.mapid
        let map = this.state.map
        let areaid = this.state.areaid
        let edit = this.state.edit
        if (!edit){ 
            return(
                <tr>
                    <td>{mapid}</td>
                    <td><img src={map} alt={"map"+mapid} width={50} height={50}/></td>
                    <td>{areaid}</td>
                    <td><Button color="primary" onClick={this.handleEdit}>Edit</Button></td>
                    <td><Button type="danger" onClick={this.handleDelete}>Delete</Button></td>
                </tr>

            )
        }
        else{
            return(
                <tr>
                    <td>{mapid}</td>
                    <td>
                    <Input type="text" defaultValue={map} placeholder="Map" onChange={this.handleChange} name="map"/>
                    </td>
                    <td>
                    <Input type="text" defaultValue={areaid} placeholder="Areaid" onChange={this.handleChange} name="areaid"/>
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
export default MapRow
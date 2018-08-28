import React, {Component} from 'react'
import { Button, Input, message} from 'antd'
import { mapApi } from '../Global'

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

    handleSubmit = () => {
        if (this.state.map!=="" &&this.state.areaid!=="" ) {
            let msg = {
                "mapid":this.state.mapid,
                "map":this.state.map,
                "areaid":this.state.areaid
            }
            fetch(mapApi.saveMap, {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(msg)

            })
            .then(res => res.json())
            .then(
                (result)=>{
                    if (result.status){
                        message.error("Edit Error")
                        console.log(result.message)
                    }
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
                    <td name="mapid">{mapid}</td>
                    <td name="map"><img src={map} alt={"map"+areaid} width={100} height={100}/></td>
                    <td name="areaid">{areaid}</td>
                    <td><Button className="edit" type="primary" onClick={this.handleEdit}>Edit</Button></td>
                    <td><Button className="delete" type="danger" onClick={this.handleDelete}>Delete</Button></td>
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
                        <Button className="submit" type="primary" onClick = {this.handleSubmit}>Submit</Button>
                    </td>
                    <td className = 'action'>
                        <Button className="cancel" type="primary" onClick = {this.handleCancel}>Cancel</Button>
                    </td>
                </tr>
            )
        }
    }
}
export default MapRow
import React, {Component} from 'react'
import { dataApi } from '../Global'
import MapRow from './MapRow'
import { message, Button, Input, Row, Col } from 'antd'

class MapManagement extends Component{

    constructor(props){
        super(props)
        this.state = {
            areaid:null,
            map:null
        }
    }

    componentDidMount = () => {
        this.getMaps()
    }

    handleChange = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    getMaps = () => {
        fetch(dataApi+"map/all", {
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else
                    this.setState({
                        maps: result,
                    })
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
    }


    deleteMap = (mapid) => {
        fetch(dataApi + "map/delete?mapid=" + mapid,{
            method:'delete',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else{
                    let maps = this.state.maps
                    for (let i in maps){
                        if (maps[i].mapid===mapid){
                            maps.splice(i,1)
                            break
                        }
                    }
                    message.success("Delete Success")
                    this.setState({maps: maps})
                }
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
    }

    handleSave = () => {
        if (this.state.map!=="" &&this.state.areaid!=="" ) {
            let msg = {
                "mapid":0,
                "map":this.state.map,
                "areaid":this.state.areaid
            }
            console.log(msg)

            fetch(dataApi+"map/save", {
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
                        message.error("Save Error")
                        console.log(result.message)
                    }
                    else {
                        message.success("Save Success")
                        let maps = this.state.maps
                        maps.push(result)
                        this.setState({map:null,areaid:null,maps:maps})
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
        let maps = this.state.maps
        let map = this.state.map
        let areaid = this.state.areaid
        return(            
			<div>
				<div>
                    <Row>
                        <Col span={3}/>
                        <Col span={4}>
                        <Input type="text" defaultValue={areaid} placeholder="Areaid" onChange={this.handleChange} name="areaid"/>
                        </Col>
                        <Col span={1}/>
                        <Col span={9}>
                        <Input type="text" defaultValue={map} placeholder="Map" onChange={this.handleChange} name="map"/>
                        </Col>
                        <Col span={3}>
                        <Button onClick={this.handleSave}>Save</Button>
                        </Col>
                    </Row>
                </div>
                <br/>
                <div>
                <Row>
                    <Col span={3}/>
                    <Col span={16}>
                    <table className="ant-table ant-table-bordered">
                    <thead className="ant-table-thead">
                        <tr>
                            <th width={200}>Mapid</th>
                            <th width={300}>Map</th>  
                            <th width={200}>Areaid</th>
                            <th width={200}>Edit</th>
                            <th width={200}>Delete</th>
                        </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                        {
                            maps?maps.map((m) => {
                                return(
                                    <MapRow key={m.mapid} map={m} deleteMap={this.deleteMap}/>
                                )
                            }):null
                        }
                    </tbody>
                    </table>
                    </Col>
                    <Col span={3}/>
                </Row>
                </div>
                <br/><br/>
			</div>
        )
    }
}
export default MapManagement
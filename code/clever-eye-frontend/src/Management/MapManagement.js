import React, {Component} from 'react'
import { dataApi } from '../Global'
import MapRow from './MapRow'
import { message, Button, Icon, Upload } from 'antd'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

class MapManagement extends Component{

    constructor(props){
        super(props)
        this.state = {
            mapString: null,
            maps:null
        }
        this.getMap()
    }

    getMap = () => {
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

    beforeUpload = (file) => {

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend =  () => {
            this.setState({mapString: reader.result});
        }    
        return false;
    }

    handleUpload = (e) => {
        e.preventDefault();
        if (this.state.mapString === null){
            message.error("upload error.")
            return
        }
        let json = {"areaid": 0, "map": this.state.mapString}

        fetch( dataApi+"map/save", {
            method:'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(json)
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else{
                    this.setState({
                        mapString: null
                    });
                    message.success('upload successfully.');
                }
            },
            (error) => {
                console.log()
                message.error(error)
            }
        )
      }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
          }));
        }
      }

      deleteMap = (mapid) => {
        fetch(dataApi + "map/delete?mapid=" + mapid,{
            method:'get',
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

    render(){
        let mapString = this.state.mapString

        let maps = this.state.maps
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );

        return(            
			<div>
				<div className="avatar-uploader">
					<Upload
						name="map"
						listType="picture-card"
						showUploadList={false}
						beforeUpload={this.beforeUpload}
						onChange={this.handleChange}
					>
						{
                            mapString ? <img src={mapString} alt="map" /> : uploadButton
                        }
                </Upload>
				<br/>
				</div>
				<div>
					<Button color="primary" type="submit" onClick={this.handleUpload}>Submit</Button>
				</div>
                <br/>
                <div width="900">
                <table className="ant-table ant-table-bordered" style={{margin:'auto'}}>
                <thead className="ant-table-thead">
                    <tr>
                        <th>Mapid</th>
                        <th>Areaid</th>  
                        <th>Map</th>
                        <th>Edit</th>
                        <th>Delete</th>
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
                </div>
			</div>
        )
    }
}
export default MapManagement
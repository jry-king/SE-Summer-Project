import React, {Component} from 'react'
import { dataApi } from '../Global'
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
            mapString: null
        }
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

    render(){
       
        let mapString = this.state.mapString

        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );

        return(
            
            <div>
                <Upload
                    name="map"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                >
                        {
                            mapString ? <img src={mapString} alt="map" /> : uploadButton
                        }
                </Upload>
                <br/>
                <Button color="primary" type="submit" onClick={this.handleUpload}>Submit</Button>
            </div>
        )
    }
}
export default MapManagement
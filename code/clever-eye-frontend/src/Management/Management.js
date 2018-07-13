import React, {Component} from 'react'
import { Tabs, Icon } from 'antd'
import Header from '../Utils/Header'
import CameraTable from './CameraTable'
import MapManagement from './MapManagement'

const TabPane = Tabs.TabPane;

class Management extends Component{

    render(){
        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="信息管理"/>
                    <Icon type="book" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Camera" key="1"><CameraTable/></TabPane>
                    <TabPane tab="Map" key="2"><MapManagement/></TabPane>
                </Tabs>
            </div>
        )
    }
}
export default Management
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import { homeUrl, liveVideoUrl, historyVideoUrl, managementUrl } from '../Global'

class MyMenu extends Component{
    constructor(props){
      super(props)
      this.state = {
        current: 'mail',
      }
    }
    
    handleClick = (e) => {
      console.log('click ', e);
      this.setState({
        current: e.key,
      });
    }

    render(){
      return(
        <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <Menu.Item key="home">
                <Link to={homeUrl}><Icon type="home" />首页</Link>
              </Menu.Item>
              <Menu.Item key="liveVideo">
                <Link to={liveVideoUrl}><Icon type="eye" />实时监控</Link>
              </Menu.Item>
            <Menu.Item key="historyVideo">
                <Link to={historyVideoUrl}><Icon type="search" />历史视频</Link>
            </Menu.Item>
            </Menu>
      )
    }
}export default MyMenu
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class MyMenu extends Component{
    constructor(props){
      super(props)
      this.state = {
          theme: 'dark',
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
                <Link to='/home'><Icon type="home" />首页</Link>
              </Menu.Item>
              <Menu.Item key="layout">
                <Link to='/layout'><Icon type="eye" />实时监控</Link>
              </Menu.Item>
            <Menu.Item key="search">
                <Link to='/layout'><Icon type="search" />搜寻</Link>
            </Menu.Item>
            </Menu>
      )
    }
}export default MyMenu
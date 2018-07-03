import React, { Component } from 'react';
import logo from '../logo.svg';
import { Button } from 'antd';
import {Link } from 'react-router-dom';

class Home extends Component {

  render() {
    return (
      <div className="App">
          <div><header className="App-header">
              <h2 className = "title">GETS | 慧眼示踪搜寻系统</h2>
              <h3 className = "subtitle">God Eye Tracking System </h3>
              <h1 className="App-title">GETS</h1>
              <img src={logo} className="App-logo" alt="logo" />
          </header></div>
          <div style={{ background: '#ECECEC', padding: '30px', height:'400px' }}>
              <br/><br/>
              <Link to='/layout'><Button type="primary" icon="eye" size="large" className ='homebutton1'>实时监控</Button></Link>
              <Link to='/layout'><Button type="primary" icon="search" size="large" className ='homebutton2'>开始搜寻</Button></Link>
              <br/><br/><br/><br/><br/><br/><br/>
              <h2 className = "footnote1">"Can't Nobody Hide from God"</h2>
              <h2 className = "footnote2">——Blind Willie Johnson </h2>
          </div>
      </div>
    );
  }
}

export default Home;

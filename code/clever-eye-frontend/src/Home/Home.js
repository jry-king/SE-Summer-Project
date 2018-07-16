import React, { Component } from 'react';
import logo from '../logo.svg';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import Header from '../Utils/Header'

class Home extends Component {

  render() {
    return (
      <div className="App">
          <div><header className="App-header">
              <Header title="GETS"/>
              <img src={logo} className="App-logo" alt="logo" />
          </header></div>
          <div style={{ background: '#ECECEC', padding: '30px', height:'800px' }}>
              <br/><br/>
              <Link to='/video/live'><Button type="primary" icon="eye" size="large" className ='homebutton1'>实时监控</Button></Link>
              <Link to='/video/history'><Button type="primary" icon="search" size="large" className ='homebutton2'>历史视频</Button></Link>
              <br/><br/><br/><br/><br/><br/><br/>
              <h2 className = "footnote1">"Can't Nobody Hide from God"</h2>
              <h2 className = "footnote2">——Blind Willie Johnson </h2>
          </div>
      </div>
    );
  }
}

export default Home;

import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Layout from './Layout/Layout';
import MyMenu from './MyMenu/MyMenu'
import Home from './HomePage/Home'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <div>
          <MyMenu/>
              <Route exact path="/layout" component={Layout}></Route>
              <Route exact path="/home" component={Home}></Route>
              <Route exact path="/" component={Home}></Route>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

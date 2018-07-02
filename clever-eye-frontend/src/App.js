import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Layout from './Layout/Layout';
import MyMenu from './MyMenu/MyMenu'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <div>
          <MyMenu/>
          <Route exact path="/layout" component={Layout}></Route>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

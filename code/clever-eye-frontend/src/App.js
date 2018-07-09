import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import LiveVideo from './LiveVideo/LiveVideo'
import HistoryVideo from './HistoryVideo/HistoryVideo'
import MyMenu from './MyMenu/MyMenu'
import Home from './Home/Home'
import Management from './Management/Management'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <MyMenu/>
            <Route exact path="/management" component={Management}></Route>
            <Route exact path="/video/live" component={LiveVideo}></Route>
            <Route exact path="/video/history" component={HistoryVideo}></Route>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/" component={Home}></Route>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

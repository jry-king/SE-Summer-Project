import React, { Component } from 'react';

class Header extends Component{

    render(){
        const title = this.props.title
        return(
            <div>
            <h2 className = "title">GETS | 慧眼示踪搜寻系统</h2>
            <h3 className = "subtitle">God Eye Tracking System </h3>
            <h1 className="App-title">{title}</h1>
            </div>
        );
    }
}
export default Header;
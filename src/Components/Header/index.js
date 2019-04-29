import React, { Component } from "react";
import Page from './Page'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <Page infoPeriodo = {this.props.infoPeriodo}/> );
    }
}
 
export default Header;
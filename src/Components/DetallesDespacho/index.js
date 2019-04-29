import React, { Component } from 'react';
import Page from './Page'

class DetallesDespacho extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  <Page detallesDespaho = {this.props.detallesDespaho}></Page> );
    }
}
 
export default DetallesDespacho;
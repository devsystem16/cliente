import React, { Component } from 'react';   
import Page from "./Page";



class MUIDatatables extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
        <Page
            getDespachos= {this.props.getDespachos}
            obtenerJsonMotorizados ={this.props.obtenerJsonMotorizados}
            cargarDetalleDespacho={this.props.cargarDetalleDespacho}
            despachos={this.props.despachos}
            abrirModalLogin={this.props.abrirModalLogin}
            closeModalLogin={this.props.closeModalLogin}
            login={this.props.login}
            quitarMotoroloDelDespacho = {this.props.quitarMotoroloDelDespacho}
          /> );
    }
}
 
export default MUIDatatables;
import React, { Component } from 'react';
import ListadoDetalleDespacho from './ListadoDetalleDespacho'


class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 

            <ListadoDetalleDespacho detallesDespacho={this.props.detallesDespaho} />
         );
    }
}
 
export default Page;
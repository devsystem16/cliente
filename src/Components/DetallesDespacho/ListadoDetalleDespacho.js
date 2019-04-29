import React, { Component } from 'react';
import DetalleDespacho from './DetalleDespacho'
import '../../Css/CssTable.css'

 
class ListadoDetalleDespacho extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

componentDidMount(){
 
}
    
  mostrarDetalleDespacho = () => {
    const detallesDespacho = this.props.detallesDespacho;

    if (detallesDespacho.length === 0) return null; 

    return (
      <React.Fragment>
        {Object.keys(detallesDespacho).map(unDetalle => ( 
          <DetalleDespacho key={unDetalle} info={this.props.detallesDespacho[unDetalle]} />
        ))}
      </React.Fragment>
    )
  }

    render() { 
        return ( 
        <table id="TableDespacho" className="table table-hover tabla-despacho">
        <thead>
          <tr>
          <td>C. Plus</td>
          <td>Descripción</td>
          <td>Cantidad</td>
          <td>Precio</td>
          </tr>
        </thead>
        <tbody>{this.mostrarDetalleDespacho()}</tbody>
      </table> );
    }
}
 
export default ListadoDetalleDespacho;
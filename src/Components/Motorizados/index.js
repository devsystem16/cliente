import React, { Component } from 'react';
import Page from './Page'

class Motorizados extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <Page
                motorizados={this.props.motorizados}
                asignarMotorizado={this.props.asignarMotorizado}
            />);
    }
}

export default Motorizados;
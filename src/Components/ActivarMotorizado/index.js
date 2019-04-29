import React, { Component } from 'react';
import Page from './Page'

class ActivarMotorizado extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <Page
                asignarMotorizado={this.props.asignarMotorizado}
                motorizados={this.props.motorizados}
            />
        );
    }
}

export default ActivarMotorizado;
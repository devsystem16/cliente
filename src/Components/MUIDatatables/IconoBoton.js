import React, { Component } from 'react';
import Motorcycle from "@material-ui/icons/Motorcycle";
import AssignmentInd from "@material-ui/icons/AssignmentInd";
import Commute from "@material-ui/icons/Commute";
import Tooltip from '@material-ui/core/Tooltip';

class IconoBoton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        if (this.props.opcion === "Por Asignar")
            return (
                <React.Fragment>
                    <Tooltip title="¿Asignar un motorizado?">
                        <Motorcycle fontSize="small" />
                    </Tooltip>
                </React.Fragment>);

        else if (this.props.opcion === "Asignado")
            return (
                <React.Fragment>
                    <Tooltip title="¿Colocar en camino?">
                        <AssignmentInd fontSize="small" />
                    </Tooltip>
                </React.Fragment>
            );

        else if (this.props.opcion === "En Camino")
            return (
                <React.Fragment>
                    <Tooltip title="¿Está entregado?">
                        <Commute fontSize="small" />
                    </Tooltip>
                </React.Fragment>
            );
    }
}

export default IconoBoton;
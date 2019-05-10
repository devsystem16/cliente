import React, { Component } from "react";
import Swal from "sweetalert2";
import Api from "./Services";
import iziToast from "izitoast";
import { Modal, Button } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import axios from "axios";


// Components
import Header from './Components/Header'
import MUIDatatables from "./Components/MUIDatatables";
import DetallesDespacho from './Components/DetallesDespacho'
import ActivarMotorizado from './Components/ActivarMotorizado'
import Motorizados from './Components/Motorizados'
import Login from './Components/Login'
import Anulacion from './Components/Anulacion'
import ImpresionFactura from './Components/ImpresionFactura'
import CardTab from './Components/Card'

// End Components


import {
  API_POST_ANULACION,
  API_POST_NOTACREDITO,
  API_POST_CLAVE_ACCESO,
  API_GET_IMPRIMIR_FACTURA,
  API_GET_LOGIN,
  _http_socket,
  API_POST_NOTIFICA_BRINGG,
  AIP_ENVIO_ESTADO
} from "./Constants";


class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonInfoPeriodo: [],
      JsonDespachos: [],
      detalllesDespacho: [],
      JsonMorolos: [],
      opcionesAnulacion: [],

      modalLogin: false,
      smShow: false,
      lgShow: false,
      response: false,
      endpoint: _http_socket,
      _state_CodigoFactura: "",
      modalAnulacion: false,
      htmlDocumento: "<center>Sin datos</center>",
      smModalError: false,
      modalLoginVerificador: false

    };
  }

  componentDidMount() {

    Swal.fire({
      title: 'Cargando despachos',
      timer: 1500,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    })

    let params;
    let rst_id;
    if (
      !localStorage.getItem("rst_id") ||
      localStorage.getItem("rst_id") === "null"
    ) {

      params = new URLSearchParams(window.location.search);
      rst_id = params.get("rst_id");
      localStorage.setItem("rst_id", rst_id);
    }

    const api = new Api();
    api.obtenerConfiguraciones()
    api.wsObtenerOpcionesAnulacion().then(response => {
      this.setState({
        opcionesAnulacion: response.data
      })
    })

    this.ObtenerWsPeriodo();
    this.getDespachos();
    this.obtenerJsonMotorizados();

    localStorage.setItem("current_invoice", "");
    var tiempoLecturaDespacho = parseInt(JSON.parse(localStorage.getItem('configuraciones')).tiempoLecturaDespacho)
    var tiempoLecturaMotorizado = parseInt(JSON.parse(localStorage.getItem('configuraciones')).tiempoLecturaMotorizado)


    if (localStorage.getItem("rst_id") !== "null") {
      this.interval = setInterval(() => {
        this.obtenerJsonMotorizados();
      }, tiempoLecturaMotorizado);

      this.interval = setInterval(() => {
        this.getDespachos();
      }, tiempoLecturaDespacho);


    } else {
      iziToast.error({
        title: "Error:",
        message: "Ocurrió un error al cargar los datos.",
        timeout: 2500,
        resetOnHover: true,
        icon: "material-icons",
        transitionIn: "flipInX",
        transitionOut: "flipOutX",
        position: "topRight"
      });
    }
  }

  render() {
    let smClose = () => this.setState({ smShow: false });

    return (
      <div className="container-fluid">
        <div className="row">
          <Header infoPeriodo={this.state.jsonInfoPeriodo} />
        </div>
        <div className="row cuadro">
          <div className="col-12 col-md-8">
            <MUIDatatables
              cargarDetalleDespacho={this.cargarDetalleDespacho}
              despachos={this.state.JsonDespachos}
              abrirModalLogin={this.abrirModalLogin}
              getDespachos={this.getDespachos}
              obtenerJsonMotorizados={this.obtenerJsonMotorizados}
              closeModalLogin={this.closeModalLogin}
              login={this.login}
              quitarMotoroloDelDespacho={this.quitarMotoroloDelDespacho}
              imprimir={this.imprimir}
            ></MUIDatatables>
          </div>

          <div className="col-12 col-md-4 ">

            <div className="">
              <div className="row">
                <div className="col-12">
                  <ActivarMotorizado
                    asignarMotorizado={this.asignarMotorizado}
                    motorizados={this.state.JsonMorolos}
                  />
                </div>
                <div className="col-12 limite-table">
                  <div className="title-table"> Motorizados Activos  ({[].concat.apply([], this.state.JsonMorolos).length}) </div>
                  <Motorizados
                    motorizados={this.state.JsonMorolos}
                    asignarMotorizado={this.asignarMotorizado}
                  />
                </div>

              </div>
              <div className="row">
                <div className="col-12 limite-table">
                  <div className="title-table"> Detalle de orden {localStorage.getItem("current_invoice")} </div>
                  <DetallesDespacho
                    detallesDespaho={this.state.detalllesDespacho}
                    funcionDesdeDespachos={this.funcionDesdeDespachos}
                    despacho={this.state._state_CodigoFactura}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


        <Login
          modalLogin={this.state.modalLogin}
          closeModalLogin={this.closeModalLogin}
          login={this.login}
        />


        <Anulacion
          opcionesAnulacion={this.state.opcionesAnulacion}
          modalAnulacion={this.state.modalAnulacion}
          fn_CloseModalAnulacion={this.fn_CloseModalAnulacion}
          fn_anularDespacho={this.fn_anularDespacho}
        />
        <Modal
          size="sm"
          show={this.state.smShow}
          onHide={smClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <ReactToPrint
            trigger={this.renderTrigger}
            content={this.renderContent}
            onBeforePrint={this.handleBeforePrint}
            onAfterPrint={this.handleAfterPrint}
          />
          <ImpresionFactura
            datos={this.state.htmlDocumento}
            ref={this.setRef}
          />
        </Modal>

        <Modal
          size="sm"
          // show={this.state.smShow}
          show={this.state.smModalError}
          onHide={smClose}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <CardTab />
        </Modal>

      </div>
    );
  }

  ObtenerWsPeriodo = () => {
    const api = new Api();
    api.ObtenerWsPeriodo().then(response => {
      // console.log("Datos periodo : ", response)


      try {


        if (response.status === 200) {
          if (response.data !== undefined) {
            if (response.data.estado !== 1) {
              if (response.data.estado === 3) {
                this.setState({
                  smModalError: true
                });

              } else {
                Swal.fire({
                  title: response.data.mensaje,
                  animation: true,
                  customClass: {
                    popup: "animated tada"
                  }
                });
              }
            }
            this.setState({
              jsonInfoPeriodo: response.data
            });

          } else {
            this.setState({
              smModalError: true
            });
          }

        } else {
          this.setState({
            smModalError: true
          });
        }

      } catch (error) {
        this.setState({
          smModalError: true
        });
      }

    })

  };

  getDespachos = () => {
    const api = new Api();
    api.ObtenerWsDespachos().then(response => {
      try {
        if (response.data.status === undefined) {
          this.setState({ JsonDespachos: response.data });

          if (([].concat.apply([], this.state.JsonDespachos).length) === 0) {
            this.setState({
              detalllesDespacho: []
            })
            
            localStorage.setItem("current_invoice", "")
          }

          // console.log("Despachos : ", this.state.JsonDespachos)
        }
      } catch (error) {
      }
    });
  };

  ObtenerDatoDespachos = parametro => {
    const api = new Api();
    api.ObtenerDatoDespachos(parametro).then(response => {

      if (response.status === 200) {
        this.setState({
          detalllesDespacho: response.data
        });
      } else {
        this.setState({
          detalllesDespacho: []
        });
      }

    });
  };

  cargarDetalleDespacho = codigoFactura => {
    this.ObtenerDatoDespachos(codigoFactura);
  };

  obtenerJsonMotorizados = () => {


    const api = new Api();
    api.obtenerJsonMotorizados()
      .then(response => {


        try {
          if (response.data.status === undefined) {
            if (response.status === 200) {
              if (response.data !== undefined) {
                this.setState({
                  JsonMorolos: response.data
                });
              }
            }
          }

        } catch (error) {

        }

      });
  };

  asignarMotorizado = (codigo, accion) => {
    var parametros = {
      accion: accion, // A: activar , D: desactivar
      codigo_restaurante: localStorage.getItem("rst_id"),
      codigo_tarjeta: codigo
    };

    const api = new Api();
    api.asignarMotorizado(parametros)
      .then(response => {
        if (response.data.status !== "200") {
          this.obtenerJsonMotorizados();
          iziToast.success({
            title: "Éxito: ",
            message: "Acción exitosa",
            timeout: 1500,
            resetOnHover: true,
            icon: "material-icons",
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
            position: "topRight"
          });
        } else {
          iziToast.error({
            title: "Error: ",
            message: "Ocurrió un problema.",
            timeout: 1500,
            resetOnHover: true,
            icon: "material-icons",
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
            position: "topRight"
          });
        }
      })
      .catch(error => {
        Swal.showValidationMessage(`Mensaje: ${error}`);
      });
  };

  // Login Credenciales anulacion
  abrirModalLogin = () => {
    this.setState({
      modalLogin: true
    });
  };

  closeModalLogin = () => {
    this.setState({
      modalLogin: false
    });
  };
  // End Login Credenciales anulacion

  handleAfterPrint = () => {
    this.setState({
      smShow: false
    });
  };
  handleBeforePrint = () => console.log("antes de impresion!");
  renderContent = () => this.componentRef;
  renderTrigger = () => <Button>imprimir</Button>;
  setRef = ref => (this.componentRef = ref);

  fn_modalAnulacion = () => {
    this.setState({
      modalAnulacion: true
    });
  };


  quitarMotoroloDelDespacho = parametros => {
    const api = new Api();
    api.quitarMotoroloDelDespacho(parametros)
      .then(response => {
        if (response.data.status === "200") {
          this.obtenerJsonMotorizados();

          this.actualizaDispositivosYcargarDespachos(false);
          iziToast.success({
            title: "Éxito: ",
            message: "Motorizado Desasignado",
            timeout: 1500,
            resetOnHover: true,
            icon: "material-icons",
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
            position: "topRight"
          });
        } else {
          iziToast.error({
            title: "Error: ",
            message: "Ocurrió un problema.",
            timeout: 1500,
            resetOnHover: true,
            icon: "material-icons",
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
            position: "topRight"
          });
        }
      })
      .catch(error => {
        Swal.showValidationMessage(`Mensaje: ${error}`);
      });
  };


  fn_anularDespacho = parametros => {

    var estadoDespacho = localStorage.getItem("status_dispatching");
    var OPCION = "";
    var esnotaCredito = false;
    var notaCreditoReqiest = "";
    if (estadoDespacho === "Por Asignar" || estadoDespacho === "Asignado") {
      OPCION = API_POST_ANULACION;
    } else {
      OPCION = API_POST_NOTACREDITO;
      esnotaCredito = true;
    }


    axios
      .post(`${OPCION}`, parametros)
      .then(response => {
        if (response.data.status === "200") {
          this.obtenerJsonMotorizados();

          // response.data.Cod_Nota_Credito
          if (esnotaCredito) {
            parametros = {
              codigo_factura: response.data.Cod_Nota_Credito,
              tipo_comprobante: "N"
            };

            notaCreditoReqiest = response.data.Cod_Nota_Credito;

            axios
              .post(`${API_POST_CLAVE_ACCESO}`, parametros)
              .then(response => {
                if (response.data.status === "200") {

                  iziToast.success({
                    title: "Éxito: ",
                    message: "Despacho Anulado",
                    timeout: 1500,
                    resetOnHover: true,
                    icon: "material-icons",
                    transitionIn: "flipInX",
                    transitionOut: "flipOutX",
                    position: "topRight"
                  });

                  this.fn_CloseModalAnulacion();

                  axios
                    .get(`${API_GET_IMPRIMIR_FACTURA}${notaCreditoReqiest}/N`)
                    .then(response => {

                      this.setState({
                        htmlDocumento: response.data.html,
                        // smShow: true
                      });
                      this.actualizaDispositivosYcargarDespachos(true);

                      this.imprimir(response.data.html)


                    });
                } else {
                  iziToast.error({
                    title: "Error: ",
                    message: "Ocurrió un problema.",
                    timeout: 1500,
                    resetOnHover: true,
                    icon: "material-icons",
                    transitionIn: "flipInX",
                    transitionOut: "flipOutX",
                    position: "topRight"
                  });
                }
              })
              .catch(error => {
                Swal.showValidationMessage(`Mensaje: ${error}`);
              });

            ///////////////////////////
          } else {


            iziToast.success({
              title: "Éxito: ",
              message: "Despacho Anulado",
              timeout: 1500,
              resetOnHover: true,
              icon: "material-icons",
              transitionIn: "flipInX",
              transitionOut: "flipOutX",
              position: "topRight"
            });

            this.fn_CloseModalAnulacion();
            this.actualizaDispositivosYcargarDespachos(false);
          }
        } else {
          iziToast.error({
            title: "Error: ",
            message: "Ocurrió un problema.",
            timeout: 1500,
            resetOnHover: true,
            icon: "material-icons",
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
            position: "topRight"
          });
        }
      })
      .catch(error => {
        Swal.showValidationMessage(`Mensaje: ${error}`);
      });
  };

  actualizaDispositivosYcargarDespachos = (notificarBringg) => {
    const api = new Api();

    if (notificarBringg) {

      var objDespacho = this.state.JsonDespachos.find(unDespacho => {
        return unDespacho.Cod_Factura === localStorage.getItem("current_invoice")
      })

      // Notificar a bringg solo si el despacho es automatico.
      if (objDespacho.tipoAsignacion === "AUTOMATICA") {
        api.wsGetIdBring(localStorage.getItem("current_invoice"))
          .then(response => {
            if (response.data.status === "200") {
              if (response.data.idBringg !== "") {

                var parametro = {
                  id: response.data.idBringg
                }

                api.wsNotificaBringg(parametro).then(res => {


                  if (res.data.success) {
                    api.wsPosInsertaAuditoria(
                      API_POST_NOTIFICA_BRINGG,
                      `Cancelar Orden : ${localStorage.getItem("current_invoice")}`,
                      response.status,
                      response.data.success
                    );
                  } else {
                    api.wsPosInsertaAuditoria(
                      API_POST_NOTIFICA_BRINGG,
                      `Cancelar Orden : ${localStorage.getItem("current_invoice")}`,
                      response.status,
                      response.data
                    );
                  }


                })

              }

            }

          })
      } // fin verificacion si es automatica.


    }

    // Obtener el estado del despacho.
    api
      .wsGetEstadoFactura(localStorage.getItem("current_invoice")) // "K020F000413035"
      .then(response => {
        // alert( JSON.stringify(response) )

        // Verificar si regreso datos.
        if (response.data.length > 0) {
          // Verificar que el dato que halla devuelto sea diferente de -
          if (response.data[0].app !== "-") {
            var parametro = {
              order_id: response.data[0].app,
              status: response.data[0].estado
            };
            // obtener el Token del agregador.
            api.wsGetTockenAgregador().then(token => {
              // alert( JSON.stringify(token) )
              if (token.status === 200) {
                api
                  .wsPatchActualizarAgregador(token.data.token, parametro)
                  .then(response => {
                    // alert( JSON.stringify(response) )

                    if (response.status === 200) {
                      api.wsPosInsertaAuditoria(
                        AIP_ENVIO_ESTADO,
                        `order_id: ${parametro.order_id} , status=${
                        parametro.status
                        }`,
                        response.data.status,
                        response.data.message
                      );
                    } else {
                      api.wsPosInsertaAuditoria(
                        AIP_ENVIO_ESTADO,
                        `order_id: ${parametro.order_id} , status=${
                        parametro.status
                        }`,
                        response.response.data.code,
                        response.response.data.message
                      );
                    }
                  })
                  .catch(error => {
                    console.log("eror", JSON.stringify(error.response));
                  });
              }
            });
          } // fin de verificar que el dato devuelto sea diferente de '-'
        } // fin de verificador del estado del despacho
      })
      .catch(error => { });

    this.getDespachos();
  };

  fn_CloseModalAnulacion = () => {
    this.setState({
      modalAnulacion: false
    });
  };

  modalLogin = () => {
    this.setState({
      modalLogin: true
    });
  };


  login = (usuario, password) => {


    axios
      .get(
        `${API_GET_LOGIN}${usuario}/${password}/${localStorage.getItem(
          "rst_id"
        )}`
      )
      .then(response => {
        if (response.data.estado !== "200") {
          localStorage.setItem("idUser", null);

          iziToast.error({
            title: "Error",
            message: "Credenciales Incorrectas.",
            position: "topRight"
          });
        } else {
          if (response.data.acceso === 1) {
            localStorage.setItem("idUser", response.data.idUser);
            this.setState({
              modalLogin: false
            });

            this.fn_modalAnulacion();
          } else {
            localStorage.setItem("idUser", null);
          }
        }
      });


  };


  imprimir = (html) => {
    var printWin = window.open('', '', 'left=500,top=0,width=300,height=577,toolbar=0,scrollbars=0,status =0');
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  }

}

export default Router;

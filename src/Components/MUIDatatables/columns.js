export 
    const options = {
      download: false,
      print: false,
      filter: false,
      responsive: "scroll", // stacked
      selectableRows: true,
      filterType: "dropdown",
      // responsive: "scroll",
      rowsPerPage: 100,

      setRowProps: row => {
        var minutes = 0;
        if (row[5] !== undefined) {
          minutes = parseInt(row[5].replace(" min", ""));
        }

        var factura = row[0];

        var minutosEspera = parseInt(JSON.parse(localStorage.getItem('configuraciones')).tiempoEspera)



        if (minutes >= minutosEspera) {
          if (localStorage.getItem("current_invoice") === factura) {
            return {
              style: { backgroundColor: "rgb(255, 117, 141)" }
            };
          } else {
            return {
              style: { backgroundColor: "pink" } // rgb(223, 237, 247)
            };
          }
        } else {
          if (localStorage.getItem("current_invoice") === factura) {
            return {
              style: { backgroundColor: "rgb(223, 244, 237)" }
            };
          }
        }
      },

      body: {
        noMatch: "ningun",
        toolTip: "Sort"
      },
      textLabels: {
        body: {
          noMatch: "Ningún despacho encontrado de momento...",
          toolTip: "Sort"
        },
        pagination: {
          next: "Sigiente",
          previous: "Anterior",
          rowsPerPage: "Filas por página:",
          displayRows: "of"
        },
        toolbar: {
          search: "Buscar",
          downloadCsv: "Download CSV",
          print: "Print",
          viewColumns: "View Columns",
          filterTable: "Filter Table"
        },
        filter: {
          all: "TODOS",
          title: "FILTROS",
          reset: "RESETEAR"
        },
        viewColumns: {
          title: "Mostrar Columnas",
          titleAria: "Show/Hide Table Columns"
        }
      },

      onRowClick: (rowData, rowState) => {
        localStorage.setItem("current_invoice", rowData[0]);
        this.props.pasarParametro(rowData[0]);
      },
      isRowSelectable: dataIndex => {
        //prevents selection of row with title "Attorney"
        // console.log("mm: " , data[dataIndex]);
        // return data[dataIndex][3] !== "Attorney";
      }
    };

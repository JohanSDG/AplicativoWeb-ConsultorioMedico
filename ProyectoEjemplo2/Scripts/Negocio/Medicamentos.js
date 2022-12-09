//ProyectoEJ2 modulo de JS

//evento inicial del JS
$(document).ready(function () {
    //evento de inicializacion
    modulo_Medicamentos.init();
});



var modulo_Medicamentos = (function () {

    var _IdMedicamentos = 0;
    var $btnNuevo, $txtCantidad, $txtNombreMedicamento, $txtFechaFab, $btnBuscar, $txtFechaVence, $ddlTipoEmpaque, $TablaMedicamentos, $btnGuardar;

    var init = function init() {

        //Obtengo la referencia del control en la variable $btnNuevo
        $btnNuevo = $("#btnNuevo");
        $btnBuscar = $("#btnBuscar");
        $btnGuardar = $("#btnGuardar");

        //Referencia a la caja de texto llamada txtNombre
        $txtNombreMedicamento = $("#txtNombreMedicamento");
        $txtFechaFab = $("#txtFechaFab");
        $txtFechaVence = $("#txtFechaVence");
        $ddlTipoEmpaque = $("#ddlTipoEmpaque");
        $txtCantidad = $("#txtCantidad");

        $btnNuevo.click(abrirModalNuevo);
        $btnBuscar.click(clicBuscar);
        $btnGuardar.click(GuardarInformacion);

        inicializaTabla();

        debugger;
        CargarListaTipoEmpaque();
       
    };

    function abrirModalNuevo() {
        debugger;
        _IdMedicamentos = 0; //indico que esun registro nuevo
        $('#myModal').modal("show");

    }

    function GuardarInformacion() {
        debugger;
        //FUNCION QUE ENVIA LOS DATOS AL CONTROLADOR Persona AL METODO IngresarPersona
        EnviarAControlador($txtNombreMedicamento.val(), $txtFechaFab.val(), $txtFechaVence.val(), $ddlTipoEmpaque.val(), $txtCantidad.val() );

    };


    function clicBuscar() {
        debugger;

        //FUNCION QUE ENVIA LOS DATOS AL CONTROLADOR Persona AL METODO IngresarPersona
        ConsultarControlador($txtNombre.val(), $txtTelefono.val(), $txtFechaNacimiento.val());

    };


    function EnviarAControlador(NombreMedicamento, fabricacion, fechaVen, TipoEmpaque, Cant) {
        debugger;
        $.ajax(
            {
                type: 'POST',
                dataType: 'json',
                data:
                {
                    id: _IdMedicamentos,
                    nombre: NombreMedicamento,
                    fabricacion: fabricacion,
                    fechaVence: fechaVen,
                    empaque: TipoEmpaque,
                    cantidad: Cant
                },
                url: '/Medicamentos/IngresarMedicamentos',
                success:
                    function (jqXHR, textStatus, errorThrown)
                    {
                        if (jqXHR.codigo == "1") {
                            $('#myModal').modal("hide"); //cierra el modal

                            //imprime en la consola, la respuesta del controlador
                            console.log(jqXHR);
                            $TablaMedicamentos.ajax.reload(); //actualiza la tabla
                           
                            alert("Se grabo la informacion");
                        } else {
                            alert("ERROR:" + jqXHR.resultado);
                        }
                    }

            });
    }


    function ConsultarControlador(NombreMedicamento, fabricacion, fechaVen, TipoEmpaque, Cant) {

        $.ajax(
            {
                type: 'POST',
                dataType: 'json',
                data:
                {
                    nombre: NombreMedicamento,
                    fabricacion: fabricacion,
                    fechaVence: fechaVen,
                    empaque: TipoEmpaque,
                    cantidad: Cant
                },
                url: '/Medicamentos/ConsultarDatos',
                success:
                    function (jqXHR, textStatus, errorThrown) {
                        debugger;
                        //imprime en la consola, la respuesta del controlador
                        console.log(jqXHR);


                    }
            });
    }

    function FormateaFecha(value) {
        if (value === null) return "";
        var pattern = /Date\(([^)]+)\)/;
        var results = pattern.exec(value);
        var dt = new Date(parseFloat(results[1]));
        return formatDate2(dt);
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date) {
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),            
            date.getFullYear(),
        ].join('-');
    }

    function formatDate2(date) {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-');
    }

    function inicializaTabla() {
        debugger;
        $TablaMedicamentos = $('#tblMedicamentos').DataTable({

            "columnDefs": [ // Ocultar columna Necesaria
                {
                    "targets": [3],
                    "visible": true,
                }
                //{
                //    "targets": [3],
                //    "bSearchable": false,
                //    "sType": 'date',
                //    "fnRender": function (oObj) {
                //        var javascriptDate = new Date(oObj.aData[0]);
                //        javascriptDate = javascriptDate.getDate() + "/" + (javascriptDate.getMonth() + 1) + "/" + javascriptDate.getFullYear();
                //        return "<div class='date'>" + javascriptDate + "<div>";
                //    }
                //}
            ],

            'responsive': true,
            'buttons': [
                'print',
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ],

            'ajax': {
                'type': "POST",
                'datatype': "Json",
                'data': function (d) {
                    //string nombre, string telefono, string fecha
                    d.nombre = ""
                    //d.fabricacion = "",
                    //d.fechaVence = ""
                    //d.empaque = ""
                    //d.cantidad = ""
                },
                'url': '/Medicamentos/ConsultarDatos',
                "dataSrc": function (d) {
                    debugger;
                    return d;
                }
            },

            "columns": [
                {
                    //"className": 'dt-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },

                { "data": "NombreMedicamento" },
                {
                    "data": "FechaFabricacion",
                    "type": "date ",
                    "render": function (value) {
                        if (value === null) return "";
                        var pattern = /Date\(([^)]+)\)/;
                        var results = pattern.exec(value);
                        var dt = new Date(parseFloat(results[1]));
                        return formatDate2(dt);
                    }
                },
                {
                    "data": "FechaVencimiento",
                    "type": "date ",
                    "render": function (value) {
                        if (value === null) return "";
                        var pattern = /Date\(([^)]+)\)/;
                        var results = pattern.exec(value);
                        var dt = new Date(parseFloat(results[1]));
                        return formatDate2(dt);
                    }
                },
                { "data": "Cantidad" },
                { "data": "TipoEmpaque", "visible": false },



                {
                    "data": null,
                    "defaultContent": "",
                    "className": "dt-center",
                    "orderable": false,
                    "render": function (data, type, row) {
                        return '\
                        <span>\
                            \
                            <div>\
                                \
                                <button type="button" class="btn btn-primary float-center btn-xs editarMedicamento">Editar</button>\
                                \
                            </div>\
                        </span> ';
                    }
                },
                {
                    "data": null,
                    "defaultContent": "",
                    "className": "dt-center",
                    "orderable": false,
                    "render": function (data, type, row) {
                        return '\
                        <span>\
                            \
                            <div>\
                                <button type = "button" class= "dropdown-btn eliminarAbonados btn btn-danger float-center" " href="#"><i class="la la - save"></i>Eliminar</a>\
                                \
                                \
                            </div>\
                        </span> ';
                    }

                },
            ],
            "oLanguage": {
                "sSearch": "Búsqueda rápida:",
                "sLengthMenu": "Listar _MENU_  registros",
                "sInfo": "Listando _START_ a _END_ de _TOTAL_ Registros",
                "sEmptyTable": "No se encontraron datos con el criterio de consulta suministrado",
                "sInfoEmpty": "Sin registros para mostrar",
                "sInfoFiltered": " (filtrando de _MAX_ registros)",
                "sProcessing": "Realizando la consulta",
                "sZeroRecords": "No hay registros coincidentes con el filtro suministrado"
            },
            "order": [[1, 'asc']]
        });

        // Add event listener for opening and closing details
        $('#tblMedicamentos tbody').on('click', 'td.dt-control', function () {
            var tr = $(this).closest('tr');
            var row = $TablaMedicamentos.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });

        $('#tblMedicamentos').on('click', '.editarMedicamento', CargarModalEditarMedicamentos);
        // cuando es .nombreclase se referencia la clase no el id, es con # cuando es con id
    }

    function CargarModalEditarMedicamentos(e) {
        debugger;
        e.preventDefault();
        var datos = $TablaMedicamentos.row($(this).parents('tr')).data();

        _IdMedicamentos = datos.id;  //coloco el id que es a llave de la tabla

        $txtNombreMedicamento.val(datos.NombreMedicamento);        

        $("#txtFechaFab").val('2022-10-05')

        var f1 = FormateaFecha(datos.FechaFabricacion);        $txtFechaFab.val(f1);
        var f2 = FormateaFecha(datos.FechaVencimiento);        $txtFechaVence.val(f2);

        $ddlTipoEmpaque.val(datos.TipoEmpaque);
        $txtCantidad.val(datos.Cantidad);

        $('#myModal').modal("show");
    }

    function CargarListaTipoEmpaque() {

        var URL = '/Medicamentos/ConsultarTipo';
                 //Controlador// Metodo o funcion!
        $.ajax(
            {
                type: 'post',
                data: null,
                dataType: 'json',
                url: URL,
                success: function (data) {
                    debugger;
                    $.each(data, function (index, optionData) {
                        $("#ddlTipoEmpaque").append("<option value='" + optionData.Id + "'>" + optionData.NombreEmpaque + "</option>");
                    });
                },
                error: function (error) {
                    //
                    console.log("ERROR EN CARGAR PRESENTACION " + error);
                    //
                    debugger;
                    alert(error.responseText);
                }
            });
    }

    return {
        init: init

    };




})();
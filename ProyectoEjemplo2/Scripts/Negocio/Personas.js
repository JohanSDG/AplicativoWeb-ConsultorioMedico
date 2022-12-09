//ProyectoEJ2 modulo de JS

//evento inicial del JS
$(document).ready(function () {
    //evento de inicializacion
    modulo_Personas.init();
});



var modulo_Personas = (function () {

    var $btnNuevo, $txtNombre, $txtTelefono, $txtFechaNacimiento, $btnBuscar, $TablaPersonas, $btnGuardar;
    var _IdPersonas; //faltaba definirla como global

    var init = function init() {

        //Obtengo la referencia del control en la variable $btnNuevo
        $btnNuevo = $("#btnNuevo");
        $btnBuscar = $("#btnBuscar");
        $btnGuardar = $("#btnGuardar");

        //Referencia a la caja de texto llamada txtNombre
        $txtNombre = $("#txtNombre");
        $txtTelefono = $("#txtTelefono");
        $txtFechaNacimiento = $("#txtFechaNacimiento");

        $btnNuevo.click(abrirModalNuevo);
        $btnBuscar.click(clicBuscar);
        $btnGuardar.click(GuardarInformacion);

        inicializaTabla();

        //alert('inicio de pagina');
    };

    function abrirModalNuevo() {
        debugger;
        _IdPersonas = 0;
        $('#myModal').modal("show");

    }

    function GuardarInformacion() {
        debugger;
        //FUNCION QUE ENVIA LOS DATOS AL CONTROLADOR Persona AL METODO IngresarPersona
       EnviarAControlador($txtNombre.val(), $txtTelefono.val(), $txtFechaNacimiento.val() );

    };


    function clicBuscar() {
        debugger;

        //FUNCION QUE ENVIA LOS DATOS AL CONTROLADOR Persona AL METODO IngresarPersona
        ConsultarControlador($txtNombre.val(), $txtTelefono.val(), $txtFechaNacimiento.val());
        
    };

    
    function EnviarAControlador(ElNombre, telefono, fechaNa) {

        $.ajax(
            {
                type: 'POST',
                dataType: 'json',
                data:
                {
                    id: _IdPersonas,
                    nombre: ElNombre,
                    tele: telefono,
                    fechanac: fechaNa
                },
                url: '/Personas/IngresarPersona',
                success:
                    function (jqXHR, textStatus, errorThrown) {
                        $('#myModal').modal("hide"); //cierra el modal

                        //imprime en la consola, la respuesta del controlador
                        console.log(jqXHR);
                        $TablaPersonas.ajax.reload(); //actualiza la tabla


                    }
            });
    }


    function ConsultarControlador(ElNombre, telefono, fechaNa) {

        $.ajax(
            {
                type: 'POST',
                dataType: 'json',
                data:
                {
                    nombre: ElNombre,
                    tele: telefono,
                    fechanac: fechaNa
                },
                url: '/Personas/ConsultarDatos',
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
        $TablaPersonas = $('#tblPersonas').DataTable({

            "columnDefs": [ // Ocultar columna Necesaria
                {
                    "targets": [3],
                    "visible": true,
                },
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
                    d.nombre = "",
                    d.telefono = "",
                    d.fecha = ""
                },
                'url': '/Personas/ConsultarDatos',
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

                { "data": "Nombres" },
                { "data": "Telefono" },
                {
                    "data": "FechaNacimiento",
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
                                <button type="button" class="btn btn-primary float-center btn-xs editarPersonas">Editar</button>\
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
        $('#tblPersonas tbody').on('click', 'td.dt-control', function () {
            var tr = $(this).closest('tr');
            var row = TablaAbonados.row(tr);

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

        $('#tblPersonas').on('click', '.editarPersonas', CargarModalEditarPersonas);

        function CargarModalEditarPersonas(e) {
            debugger;
            e.preventDefault();
            var datos = $TablaPersonas.row($(this).parents('tr')).data();

            _IdPersonas = datos.id;  //coloco el id que es a llave de la tabla

            $txtNombre.val(datos.Nombres);
            $txtTelefono.val(datos.Telefono);

            $("#txtFechaNacimiento").val('2022-10-05')

            var f1 = FormateaFecha(datos.FechaNacimiento);             $txtFechaNacimiento.val(f1);
            

            $('#myModal').modal("show");
        }

    }


    return {
        init: init

    };




})();
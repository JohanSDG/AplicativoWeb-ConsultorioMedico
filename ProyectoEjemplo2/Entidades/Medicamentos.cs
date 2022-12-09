using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProyectoEjemplo2.Entidades
{
    public class Medicamentos
    {

        public int id { get; set; }
        public string NombreMedicamento { get; set; }
        public DateTime FechaFabricacion { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public int Cantidad { get; set; }
        public int TipoEmpaque { get; set; }
        public int EstadoRegistro { get; set; }

    }

}
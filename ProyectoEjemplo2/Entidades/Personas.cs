using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProyectoEjemplo2.Entidades
{
    public class Personas
    {
        public int id { get; set; }

        public string Nombres { get; set; }
        public string Telefono { get; set; }
        public DateTime FechaNacimiento { get; set; }
       
    }

}
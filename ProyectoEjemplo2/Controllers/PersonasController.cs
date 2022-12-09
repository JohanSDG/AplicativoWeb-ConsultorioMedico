using ProyectoEjemplo2.Entidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProyectoEjemplo2.Controllers
{
    public class PersonasController : Controller
    {
        // GET: Personas
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]

        public JsonResult IngresarPersona(int id, string nombre, string tele, string fechanac)
        {
            string mensaje = "", codigo = "";
            try
            {
                mensaje = "Elnombre es: " + nombre;
                if (id == 0) { 
                    GrabarDatos(nombre, tele, fechanac);
                }
                else
                {
                    AcutalizarDatos(id, nombre, tele, fechanac);

                }
            }
            catch (Exception err)
            {
                mensaje = "Comuniquise con el administrador del sistema.<br>Error: ";
                if (err.Message.ToString().IndexOf("\n") >= 0)
                    mensaje = mensaje + err.Message.ToString().Replace("\"", " ").Substring(0, err.Message.ToString().IndexOf("\n"));
                else
                    mensaje = "Comuníquese con el administrador del Sistema.<br>Error: " + err.Message.ToString().Replace("'", "");
                return Json(new { codigo = codigo, resultado = mensaje }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { codigo = codigo, resultado = mensaje });

        }

        private bool GrabarDatos(string nombre, string telefono, string fecha)
        {
            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;

            String query = "INSERT INTO dbo.personas_ejemplo2(Nombres, Telefono, FechaNacimiento) VALUES (@Nombres,@Telefono,@FechaNacimiento)";

            using (SqlConnection connection = new SqlConnection(CadenaConexion))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = nombre;
                command.Parameters.Add("@Telefono", SqlDbType.VarChar).Value = telefono;
                command.Parameters.Add("@FechaNacimiento", SqlDbType.Date).Value = fecha;


                connection.Open();
                command.ExecuteNonQuery();
            }


            return true;
        }

        private bool AcutalizarDatos(int id, string nombre, string telefono, string fecha)
        {
            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;

            String query = "UPDATE dbo.personas_ejemplo2 SET Nombres = @Nombres, Telefono = @Telefono, FechaNacimiento = @FechaNacimiento WHERE id = @id";

            using (SqlConnection connection = new SqlConnection(CadenaConexion))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = nombre;
                command.Parameters.Add("@Telefono", SqlDbType.VarChar).Value = telefono;
                command.Parameters.Add("@FechaNacimiento", SqlDbType.Date).Value = fecha;
                command.Parameters.Add("@id", SqlDbType.Int).Value = id;


                connection.Open();
                command.ExecuteNonQuery();
            }


            return true;
        }


        [HttpPost]
        public JsonResult ConsultarDatos(string nombre, string telefono, string fecha)
        {

            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;
            DataTable dataTable = new DataTable();
            string query = "select * from personas_ejemplo2";

            SqlConnection conn = new SqlConnection(CadenaConexion);
            SqlCommand cmd = new SqlCommand(query, conn);
            conn.Open();

            // create data adapter
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            // this will query your database and return the result to your datatable
            da.Fill(dataTable);
            conn.Close();
            da.Dispose();

            List<Personas> datos = Utilitario.ConvertTo<Personas>(dataTable);
            return Json(datos);

        }

        /*
        public List<ConsultaPersonas> ConsultaAbonados(int? NumeroDocumento, string Nombres)
        {
            try
            {
                SqlParameter[] parameters = new SqlParameter[] {
                               new SqlParameter("@NumeroDocumento", NumeroDocumento),
                                new SqlParameter("@Nombres", Nombres)
                    };

                DataTable obj = transactions.ExecuteDataTableCMD("[dbo].[PA_CONSULTARABONADOS]", parameters);
                if (obj != null)
                {
                    List<ConsultaPersonas> datos = Utilitario.ConvertTo<ConsultaPersonas>(obj);
                    return datos;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        */

    }
}
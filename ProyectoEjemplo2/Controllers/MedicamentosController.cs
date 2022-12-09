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
    public class MedicamentosController : Controller
    {
        // GET: Medicamentos
        public ActionResult Index()
        {
            return View();
        }




        [HttpPost]
        public JsonResult IngresarMedicamentos(int id, string nombre, DateTime fabricacion, DateTime fechaVence, string empaque, string cantidad)
        {
            string mensaje = "", codigo = "";
            try
            {
                
                if (id == 0) 
                { 
                    InsertarDatosMedicamentos(nombre, fabricacion, fechaVence, empaque, cantidad);
                    codigo = "1";
                    mensaje = "Informacion creada correctamente";
                }
                else
                {
                    ActualizarDatosMedicamentos(id,nombre, fabricacion, fechaVence, empaque, cantidad);
                    codigo = "1";
                    mensaje = "Informacion actualizada correctamente";
                }

            }
            catch (Exception err)
            {
                codigo = "-1";
                mensaje = "Comuniquise con el administrador del sistema.<br>Error: ";
                if (err.Message.ToString().IndexOf("\n") >= 0)
                    mensaje = mensaje + err.Message.ToString().Replace("\"", " ").Substring(0, err.Message.ToString().IndexOf("\n"));
                else
                    mensaje = "Comuníquese con el administrador del Sistema.<br>Error: " + err.Message.ToString().Replace("'", "");
                return Json(new { codigo = codigo, resultado = mensaje }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { codigo = codigo, resultado = mensaje });

        }

        private bool InsertarDatosMedicamentos(string nombre, DateTime fabricacion, DateTime fechaVence, string empaque, string cantidad)
        {
            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;

            String query = "INSERT INTO dbo.Medicamentos(NombreMedicamento,FechaFabricacion,FechaVencimiento,Cantidad,TipoEmpaque,EstadoRegistro) VALUES (@NombreMedicamento, @FechaFabricacion, @FechaVencimiento, @Cantidad, @TipoEmpaque, @EstadoRegistro)";

            using (SqlConnection connection = new SqlConnection(CadenaConexion))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.Add("@NombreMedicamento", SqlDbType.VarChar).Value = nombre;
                command.Parameters.Add("@FechaFabricacion", SqlDbType.DateTime).Value = fabricacion;
                command.Parameters.Add("@FechaVencimiento", SqlDbType.DateTime).Value = fechaVence;
                command.Parameters.Add("@TipoEmpaque", SqlDbType.Int).Value = empaque;
                command.Parameters.Add("@EstadoRegistro", SqlDbType.Int).Value = 1;
                command.Parameters.Add("@Cantidad", SqlDbType.Int).Value = cantidad;


                connection.Open();
                command.ExecuteNonQuery();
            }




            return true;
        }


        private bool ActualizarDatosMedicamentos(int id, string nombre, DateTime fabricacion, DateTime fechaVence, string empaque, string cantidad)
        {
            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;

            String query = "UPDATE dbo.Medicamentos SET NombreMedicamento =  @NombreMedicamento, FechaFabricacion = @FechaFabricacion, FechaVencimiento = @FechaVencimiento, Cantidad = @Cantidad, TipoEmpaque = @TipoEmpaque, EstadoRegistro = @EstadoRegistro  WHERE Id = @id";

            using (SqlConnection connection = new SqlConnection(CadenaConexion))
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.Add("@NombreMedicamento", SqlDbType.VarChar).Value = nombre;
                command.Parameters.Add("@FechaFabricacion", SqlDbType.DateTime).Value = fabricacion;
                command.Parameters.Add("@FechaVencimiento", SqlDbType.DateTime).Value = fechaVence;
                command.Parameters.Add("@TipoEmpaque", SqlDbType.Int).Value = empaque;
                command.Parameters.Add("@EstadoRegistro", SqlDbType.Int).Value = 1;
                command.Parameters.Add("@Cantidad", SqlDbType.Int).Value = cantidad;
                command.Parameters.Add("@id", SqlDbType.Int).Value = id;


                connection.Open();
                command.ExecuteNonQuery();
            }




            return true;
        }

        [HttpPost]
        public JsonResult ConsultarDatos(string nombre) //, DateTime fabricacion, DateTime fechaVence, string empaque, string cantidad, string estado)
        {

            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;
            DataTable dataTable = new DataTable();
            string query = "select * from Medicamentos";

            SqlConnection conn = new SqlConnection(CadenaConexion);
            SqlCommand cmd = new SqlCommand(query, conn);
            conn.Open();

            // create data adapter
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            // this will query your database and return the result to your datatable
            da.Fill(dataTable);
            conn.Close();
            da.Dispose();

            List<Medicamentos> datos = Utilitario.ConvertTo<Medicamentos>(dataTable);
            return Json(datos);

        }

        [HttpPost]
        public JsonResult ConsultarTipo() //, DateTime fabricacion, DateTime fechaVence, string empaque, string cantidad, string estado)
        {

            string CadenaConexion = System.Configuration.ConfigurationManager.ConnectionStrings["Conexion"].ConnectionString;
            DataTable dataTable = new DataTable();
            string query = "select * from TipoEmpaque";

            SqlConnection conn = new SqlConnection(CadenaConexion);
            SqlCommand cmd = new SqlCommand(query, conn);
            conn.Open();

            // create data adapter
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            // this will query your database and return the result to your datatable
            da.Fill(dataTable);
            conn.Close();
            da.Dispose();

            
            List<TipoEmpaque> datos = Utilitario.ConvertTo<TipoEmpaque>(dataTable);
            var x = Json(datos);
            return Json(datos);


        }

        

    }

}
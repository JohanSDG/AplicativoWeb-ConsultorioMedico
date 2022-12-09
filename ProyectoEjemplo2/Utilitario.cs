using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace ProyectoEjemplo2
{
    public class Utilitario
    {
        /// <summary>
        /// Convierte un DataTable a la estructura definida
        /// </summary>
        /// <typeparam name="T">Estructura de datos definida</typeparam>
        /// <param name="dtDatos"></param>
        /// <returns>Estructura con la informacion del datatable</returns>
        public static List<T> ConvertTo<T>(DataTable dtDatos) where T : new()
        {
            List<T> Temp = new List<T>();
            try
            {
                List<string> columnsNames = new List<string>();
                foreach (DataColumn DataColumn in dtDatos.Columns)
                    columnsNames.Add(DataColumn.ColumnName);
                Temp = dtDatos.AsEnumerable().ToList().ConvertAll<T>(row => getObject<T>(row, columnsNames));
                return Temp;
            }
            catch
            {
                return Temp;
            }
        }

        /// <summary>
        /// Obtiene la estructura de la entidad T
        /// </summary>
        /// <typeparam name="T">Entidad T</typeparam>
        /// <param name="row">fila del datatable</param>
        /// <param name="columnsName">nombre de las columnas del datatable</param>
        /// <returns>Entidad T con la informacion almacenada</returns>
        public static T getObject<T>(DataRow row, List<string> columnsName) where T : new()
        {
            T obj = new T();
            try
            {
                string columnname = "";
                string value = "";
                PropertyInfo[] Properties;
                Properties = typeof(T).GetProperties();
                foreach (PropertyInfo objProperty in Properties)
                {
                    columnname = columnsName.Find(name => name.ToLower() == objProperty.Name.ToLower());
                    if (!string.IsNullOrEmpty(columnname))
                    {
                        value = row[columnname].ToString();
                        if (!string.IsNullOrEmpty(value))
                        {
                            if (Nullable.GetUnderlyingType(objProperty.PropertyType) != null)
                            {
                                objProperty.SetValue(obj, Convert.ChangeType(value, Type.GetType(Nullable.GetUnderlyingType(objProperty.PropertyType).ToString())), null);
                            }
                            else
                            {
                                objProperty.SetValue(obj, Convert.ChangeType(value, Type.GetType(objProperty.PropertyType.ToString())), null);
                            }
                        }
                    }
                }
                return obj;
            }
            catch
            {
                return obj;
            }
        }

        /// <summary>
        /// Remueve caracteres especiales de un string
        /// </summary>
        /// <param name="str">Cadena a ser evaluada</param>
        /// <returns>Retorna string limpio sin caracteres</returns>
        public static string RemoveSpecialCharacters(string str)
        {
            StringBuilder sb = new StringBuilder();
            foreach (char c in str)
            {
                if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'))
                {
                    sb.Append(c);
                }
                else if (c.Equals('á'))
                {
                    sb.Append('a');
                }
                else if (c.Equals('é'))
                {
                    sb.Append('e');
                }
                else if (c.Equals('ó'))
                {
                    sb.Append('o');
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// Deserializa string de xml a entidad generica
        /// </summary>
        /// <typeparam name="T">Tipo de objeto generico</typeparam>
        /// <param name="toDeserialize">Objeto generico</param>
        /// <returns>Retorna tipo de objeto generico</returns>
        public static T Deserialize<T>(string toDeserialize)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            StringReader textReader = new StringReader(toDeserialize);
            return (T)xmlSerializer.Deserialize(textReader);
        }

        /// <summary>
        /// Serializa objeto generico a string de xml
        /// </summary>
        /// <typeparam name="T">Tipo de objeto generico</typeparam>
        /// <param name="toSerialize">Objeto generico</param>
        /// <returns>Retorna string de xml</returns>
        public static string Serialize<T>(T toSerialize)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            StringWriter textWriter = new StringWriter();
            xmlSerializer.Serialize(textWriter, toSerialize);
            return textWriter.ToString();
        }

    }

}
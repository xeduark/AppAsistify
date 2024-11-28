import React, { useState, useEffect } from "react";
import { IoBarChartSharp } from "react-icons/io5";
import BarChart from "../graficos/Barcharts";
import DonutChart from "../graficos/Donutchart";
import ColumnChart from "../graficos/Columnchart";
import chartStyles from "./home.module.css";
import BarCiudades from "../graficos/Ciudades";

const Home = () => {
  // Estados para manejar los datos, la carga y los errores
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook useEffect para realizar la petición al backend cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Indicamos que se está cargando
        const response = await fetch(
          "http://localhost:5000/api/generar/graficos"
        ); // Petición al backend
        if (!response.ok) {
          // Manejo de errores HTTP
          const message = `HTTP error! status: ${response.status}`;
          throw new Error(message);
        }
        const jsonData = await response.json(); // Convertimos la respuesta a JSON
        setData(jsonData); // Actualizamos el estado con los datos recibidos
      } catch (error) {
        // Manejo de errores generales
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Indicamos que la carga ha terminado
      }
    };

    fetchData();
  }, []);

  // Renderizado condicional basado en el estado de carga y errores
  if (loading) {
    return <p>Cargando datos de empleados...</p>;
  }

  if (error) {
    return <p>Error al cargar datos: {error.message}</p>;
  }

  if (!data) {
    return <p>No hay datos disponibles.</p>;
  }

  // Gráfico de líneas: Cantidad total de empleados
  const totalEmpleados = data ? data.totalEmpleados || 0 : 0; // Ajusta la clave si es diferente en tu respuesta

  // Gráfico de barras: Nivel educativo y carrera
  const empleadosPorNivelEducativoYCarrera = {};
  if (data && data.empleados) {
    data.empleados.forEach((empleado) => {
      const key = `${empleado.nivelEducativo}-${empleado.carrera}`;
      empleadosPorNivelEducativoYCarrera[key] =
        (empleadosPorNivelEducativoYCarrera[key] || 0) + 1;
    });
  }

  // Ajustar la variable 'empleadosConCarrera'
  const empleadosConCarrera = data ? data.empleadosConCarrera || 0 : 0;

  // Gráfico de dona: Porcentajes de estado de asistencias
  const estadoAsistenciasPorcentajes = {};
  let totalAsistencias = 0;

  if (data && data.estadoAsistencias) {
    for (const estado in data.estadoAsistencias) {
      totalAsistencias += data.estadoAsistencias[estado];
    }
    for (const estado in data.estadoAsistencias) {
      estadoAsistenciasPorcentajes[estado] = (
        (data.estadoAsistencias[estado] / totalAsistencias) *
        100
      ).toFixed(2);
    }
  }

  // Datos para el gráfico de Ciudades
  const ciudadesData = data && data.ciudades ? data.ciudades : [];

  return (
    <div className={chartStyles.main}>
      <div className={chartStyles.containerMain}>
        <h1 className={chartStyles.tittle}>
          <IoBarChartSharp /> Home
        </h1>
      </div>
      <div className={chartStyles.grafContain}>
        <div className={chartStyles.barrasContainer}>
          <BarChart
            data={{
              series: [
                {
                  name: "Nivel Educativo",
                  data: Object.values(data.empleadosPorNivelEducativo),
                },
                {
                  name: "Con Carrera",
                  data: [data.empleadosConCarrera || 0], // Manejo de caso nulo
                },
              ],
              categories: [...Object.keys(data.empleadosPorNivelEducativo)],
            }}
          />
        </div>
        <div className={chartStyles.donaContainer}>
          <DonutChart
            data={{
              series: Object.values(data.estadoAsistenciasCounts).map(
                (count) => (count / data.totalEmpleados) * 100
              ), //Calcula los porcentajes aqui
              labels: Object.keys(data.estadoAsistenciasCounts),
            }}
          />
        </div>
      </div>
      <div className={chartStyles.containerGraf}>
        <div className={chartStyles.barContainer}>
          <ColumnChart
            data={{
              series: [{ data: Object.values(data.estadoAsistenciasCounts) }],
              categories: Object.keys(data.estadoAsistenciasCounts),
            }}
          />
        </div>
        <div className={chartStyles.columnContainer}>
          <ColumnChart
            data={{
              series: [{ data: [data.totalEmpleados] }],
              categories: ["Total Empleados"],
            }}
          />
        </div>
      </div>
      <div className={chartStyles.ciudadesContainer}>
        <div className={chartStyles.ciudades}>
          <BarCiudades
            data={{
              series: [{ data: ciudadesData.map((ciudad) => ciudad.cantidad) }],
              categories: ciudadesData.map((ciudad) => ciudad.nombre),
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;

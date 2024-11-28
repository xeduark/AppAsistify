const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/graficos", async (req, res) => {
  try {
    const empleadosResponse = await fetch("http://localhost:5000/api/empleados/ver");
    const asistenciasResponse = await fetch("http://localhost:5000/api/asistencias/ver");

    // Verificación de éxito en las respuestas de la API
    if (!empleadosResponse.ok) {
      throw new Error(`Error fetching empleados: ${empleadosResponse.statusText}`);
    }
    if (!asistenciasResponse.ok) {
      throw new Error(`Error fetching asistencias: ${asistenciasResponse.statusText}`);
    }

    const empleados = await empleadosResponse.json();
    const asistencias = await asistenciasResponse.json();

    // Estructura de datos que se enviará al frontend
    const datosGraficos = {
      totalEmpleados: empleados.length,
      empleadosPorNivelEducativo: {},
      empleadosConCarrera: 0,
      estadoAsistenciasCounts: {},
      empleadosPorCiudad: {},
    };

    // Procesamiento para el gráfico de barras (nivel educativo y empleados con carrera)
    const niveles = ["Bachiller", "Técnico", "Posgrado", "Universitario"];
    empleados.forEach(empleado => {
      const nivel = niveles.includes(empleado.nivelEducativo) ? empleado.nivelEducativo : "Otros";
      datosGraficos.empleadosPorNivelEducativo[nivel] = (datosGraficos.empleadosPorNivelEducativo[nivel] || 0) + 1;

      if (empleado.carrera && empleado.carrera.trim() !== "") {
        datosGraficos.empleadosConCarrera++;
      }

      // Conteo de empleados por ciudad (CORREGIDO - sin bucle anidado)
      const ciudad = empleado.ciudad || "Desconocida";
      datosGraficos.empleadosPorCiudad[ciudad] = (datosGraficos.empleadosPorCiudad[ciudad] || 0) + 1;
    });

    // Crear el array empleadosPorCiudad después del bucle principal
    const empleadosPorCiudad = [];
    for (const ciudad in datosGraficos.empleadosPorCiudad) {
      empleadosPorCiudad.push({
        nombre: ciudad,
        cantidad: datosGraficos.empleadosPorCiudad[ciudad],
      });
    }
    datosGraficos.ciudades = empleadosPorCiudad;


    // Procesamiento para el gráfico de dona y barras (Estado de Asistencias)
    const estadoAsistenciasCounts = {};
    let totalAsistencias = 0;
    asistencias.forEach((asistencia) => {
      const estado = asistencia.estado;
      estadoAsistenciasCounts[estado] = (estadoAsistenciasCounts[estado] || 0) + 1;
      totalAsistencias++;
    });

    datosGraficos.estadoAsistenciasCounts = estadoAsistenciasCounts;

    res.json(datosGraficos);
  } catch (error) {
    console.error("Error generando gráficos:", error);
    res.status(500).json({ error: "Error al generar gráficos: " + error.message });
  }
});

module.exports = router;
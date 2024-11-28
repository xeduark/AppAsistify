const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
router.get("/graficos", async (req, res) => {
  try {
    const empleados = await (
      await fetch("http://localhost:5000/api/empleados/ver")
    ).json();
    const asistencias = await (
      await fetch("http://localhost:5000/api/asistencias/ver")
    ).json();

    const datosGraficos = {
      totalEmpleados: empleados.length,
      empleadosPorNivelEducativoYCarrera: {},
      estadoAsistenciasCounts: {}, // Solo conteos ahora
    };

    // Procesamiento para el gráfico de barras (nivel educativo y empleados con carrera)
const niveles = ["Bachiller", "Técnico", "Posgrado", "Universitario"];
const empleadosPorNivelEducativo = {};
let empleadosConCarrera = 0;

empleados.forEach(empleado => {
  const nivel = niveles.includes(empleado.nivelEducativo) ? empleado.nivelEducativo : "Otros";
  empleadosPorNivelEducativo[nivel] = (empleadosPorNivelEducativo[nivel] || 0) + 1;
  if (empleado.carrera && empleado.carrera.trim() !== "") { // Verifica si carrera tiene un valor
    empleadosConCarrera++;
  }
});

datosGraficos.empleadosPorNivelEducativo = empleadosPorNivelEducativo;
datosGraficos.empleadosConCarrera = empleadosConCarrera;

    // Procesamiento para el gráfico de dona y barras (Estado de Asistencias)
    const estadoAsistenciasCounts = {};
    let totalAsistencias = 0;
    asistencias.forEach((asistencia) => {
      const estado = asistencia.estado;
      estadoAsistenciasCounts[estado] =
        (estadoAsistenciasCounts[estado] || 0) + 1;
      totalAsistencias++;
    });

    datosGraficos.estadoAsistenciasCounts = estadoAsistenciasCounts;


    res.json(datosGraficos);
  } catch (error) {
    console.error("Error generando gráficos:", error);
    res
      .status(500)
      .json({ error: "Error al generar gráficos: " + error.message });
  }
});

module.exports = router;

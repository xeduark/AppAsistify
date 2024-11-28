const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig');

// Ruta para contar asistencias y ausencias por empleado y guardar en 'reportes'
router.get('/generar-reporte/:empleadoID', async (req, res) => {
  try {
    const { empleadoID } = req.params;

    // Consultar asistencias del empleado
    const asistenciasSnapshot = await db.collection('asistencias').where('empleadoID', '==', empleadoID).get();
    const totalAsistencias = asistenciasSnapshot.size;

    // Consultar ausencias del empleado
    const ausenciasSnapshot = await db.collection('ausencias').where('empleadoID', '==', empleadoID).get();
    const totalAusencias = ausenciasSnapshot.size;

    // Crear un nuevo documento en la colección 'reportes'
    const reporte = {
      empleadoID,
      totalAsistencias,
      totalAusencias,
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
    };

    // Guardar el reporte en la colección 'reportes'
    const reporteRef = await db.collection('reportes').add(reporte);

    res.json({
      mensaje: 'Reporte generado exitosamente',
      reporteID: reporteRef.id,
      ...reporte
    });
  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
});

// Exportar el router
module.exports = router;

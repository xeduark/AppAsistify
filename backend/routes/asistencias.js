const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig');
const admin = require('firebase-admin');  

// Función para formatear un Timestamp de Firebase
const formatTimestamp = (timestamp) => {
  if (timestamp instanceof admin.firestore.Timestamp) {
    return timestamp.toDate().toISOString(); // ISO 8601 para consistencia
  } else if (typeof timestamp === 'string'){
    return timestamp; 
  } else {
    return null; // Maneja el caso de que no sea ni Timestamp ni string
  }
};
  
  
  // Ruta para obtener todas las asistencias
  router.get('/ver', async (req, res) => {
    try {
      const asistenciasSnapshot = await db.collection('asistencias').get();
      const asistencias = asistenciasSnapshot.docs.map(doc => {
        const data = doc.data();
        // Formatear las fechas antes de enviarlas
        return {
          id: doc.id,
          ...Object.keys(data).reduce((acc, key) => {
            acc[key] = formatTimestamp(data[key]); // Formateamos solo los campos que sean Timestamps
            return acc;
          }, {}),
        };
      });
  
      res.json(asistencias);
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  });
  
  // Ruta para obtener una asistencia por ID
router.get('/:id', async (req, res) => {
  try {
    const asistencia = await db.collection('asistencias').doc(req.params.id).get();
    if (!asistencia.exists) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }

    const data = asistencia.data();
    const formattedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = formatTimestamp(data[key]); 
        return acc;
    }, {});

    res.json({ id: asistencia.id, ...formattedData }); // Aquí formateamos antes de enviar
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    res.status(500).json({ error: 'Error al obtener asistencia' });
  }
});
  

// CREAR UNA NUEVA ASISTENCIA
router.post('/crear', async (req, res) => {
  try {
    const { empleadoID, estado, fecha, horaEntrada, horaSalida } = req.body;

    // Validar que los campos requeridos están presentes
    if (!empleadoID || !estado || !fecha || !horaEntrada || !horaSalida) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevaAsistencia = { empleadoID, estado, fecha, horaEntrada, horaSalida };
    const docRef = await db.collection('asistencias').add(nuevaAsistencia);

    res.status(201).json({ id: docRef.id, ...nuevaAsistencia });
  } catch (error) {
    console.error('Error al crear asistencia:', error);
    res.status(500).json({ error: 'Error al crear asistencia' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const asistenciaId = req.params.id;
    const { empleadoID, estado, fecha, horaEntrada, horaSalida } = req.body;

    if (!empleadoID || !estado || !fecha || !horaEntrada || !horaSalida) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
      // Convertir fecha y hora correctamente
      const parsedFecha = new Date(`${fecha}T00:00:00`);
      const parsedHoraEntrada = new Date(`${fecha}T${horaEntrada}`);
      const parsedHoraSalida = new Date(`${fecha}T${horaSalida}`);

      if (isNaN(parsedFecha) || isNaN(parsedHoraEntrada) || isNaN(parsedHoraSalida)) {
        return res.status(400).json({ error: "Formato de fecha u hora inválido." });
      }

      const asistenciaRef = db.collection('asistencias').doc(asistenciaId);
      await asistenciaRef.update({
        empleadoID,
        estado,
        fecha: admin.firestore.Timestamp.fromDate(parsedFecha),
        horaEntrada: admin.firestore.Timestamp.fromDate(parsedHoraEntrada),
        horaSalida: admin.firestore.Timestamp.fromDate(parsedHoraSalida),
      });

      res.json({ message: 'Asistencia actualizada correctamente' });
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
      return res.status(400).json({ error: 'Formato de fecha u hora inválido. Asegúrate de que sean cadenas ISO 8601.' });
    }
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    res.status(500).json({ error: 'Error al actualizar asistencia: ' + error.message });
  }
});


// ELIMINAR UNA ASISTENCIA
router.delete('/:id', async (req, res) => {
  try {
    const asistenciaId = req.params.id;

    const asistenciaRef = db.collection('asistencias').doc(asistenciaId);
    const asistenciaDoc = await asistenciaRef.get();

    if (!asistenciaDoc.exists) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }

    await asistenciaRef.delete();
    res.json({ message: 'Asistencia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar asistencia:', error);
    res.status(500).json({ error: 'Error al eliminar asistencia' });
  }
});

module.exports = router;

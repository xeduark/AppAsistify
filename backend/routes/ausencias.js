const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig'); // Ajusta según la ubicación de tu configuración de Firebase
const admin = require('firebase-admin');

// Función para formatear un Timestamp de Firebase
const formatTimestamp = (timestamp) => {
  if (timestamp instanceof admin.firestore.Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Obtener todas las ausencias
router.get('/ver', async (req, res) => {
  try {
    const ausenciasSnapshot = await db.collection('ausencias').get();
    const ausencias = ausenciasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: formatTimestamp(doc.data().fecha) // Formateamos la fecha si es necesaria
    }));

    res.json(ausencias);
  } catch (error) {
    console.error('Error al obtener ausencias:', error);
    res.status(500).json({ error: 'Error al obtener ausencias' });
  }
});

// Obtener una ausencia por ID
router.get('/:id', async (req, res) => {
  try {
    const ausenciaDoc = await db.collection('ausencias').doc(req.params.id).get();
    if (!ausenciaDoc.exists) {
      return res.status(404).json({ error: 'Ausencia no encontrada' });
    }

    const data = ausenciaDoc.data();
    res.json({
      id: ausenciaDoc.id,
      ...data,
      fecha: formatTimestamp(data.fecha) // Formatear la fecha
    });
  } catch (error) {
    console.error('Error al obtener la ausencia:', error);
    res.status(500).json({ error: 'Error al obtener la ausencia' });
  }
});

// Crear una nueva ausencia
router.post('/crear', async (req, res) => {
  try {
    const { empleadoID, estado, fecha, motivo, tipo } = req.body;

    if (!empleadoID || !estado || !fecha || !motivo || !tipo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevaAusencia = {
      empleadoID,
      estado,
      fecha: admin.firestore.Timestamp.fromDate(new Date(fecha)),
      motivo,
      tipo
    };

    const docRef = await db.collection('ausencias').add(nuevaAusencia);
    res.status(201).json({ id: docRef.id, ...nuevaAusencia });
  } catch (error) {
    console.error('Error al crear la ausencia:', error);
    res.status(500).json({ error: 'Error al crear la ausencia' });
  }
});

// Actualizar una ausencia
router.put('/:id', async (req, res) => {
  try {
    const { empleadoID, estado, fecha, motivo, tipo } = req.body;

    if (!empleadoID || !estado || !fecha || !motivo || !tipo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const parsedFecha = new Date(Date.parse(fecha));
    if (isNaN(parsedFecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido' });
    }

    const ausenciaRef = db.collection('ausencias').doc(req.params.id);
    await ausenciaRef.update({
      empleadoID,
      estado,
      fecha: admin.firestore.Timestamp.fromDate(parsedFecha),
      motivo,
      tipo
    });

    res.json({ message: 'Ausencia actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la ausencia:', error);
    res.status(500).json({ error: 'Error al actualizar la ausencia' });
  }
});

// Eliminar una ausencia
router.delete('/:id', async (req, res) => {
  try {
    const ausenciaRef = db.collection('ausencias').doc(req.params.id);
    const ausenciaDoc = await ausenciaRef.get();

    if (!ausenciaDoc.exists) {
      return res.status(404).json({ error: 'Ausencia no encontrada' });
    }

    await ausenciaRef.delete();
    res.json({ message: 'Ausencia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la ausencia:', error);
    res.status(500).json({ error: 'Error al eliminar la ausencia' });
  }
});

module.exports = router;

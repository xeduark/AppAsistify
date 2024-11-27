const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig');

//TODOS LOS EMPLEADOS

router.get('/ver', async (req, res) => {
  try {
    const empleadosSnapshot = await db.collection('empleados').get();
    const empleados = empleadosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(empleados);
  } catch (error) {
    console.error('Error fetching empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// EMPLEADO POR ID
router.get('/:id', async (req, res) => {
  try {
    const empleado = await db.collection('empleados').doc(req.params.id).get();
    if (!empleado.exists) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ id: empleado.id, ...empleado.data() });
  } catch (error) {
    console.error('Error fetching empleado:', error);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
});


// CREAR EMPLEADO
router.post('/crear', async (req, res) => {
  try {
    const nuevoEmpleado = req.body;
    const docRef = await db.collection('empleados').add(nuevoEmpleado);
    res.status(201).json({ id: docRef.id, ...nuevoEmpleado });
  } catch (error) {
    console.error('Error creating empleado:', error);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
});

// ACTUALIZAR EMPLEADO
router.put('/:id', async (req, res) => {
  try {
    const empleadoId = req.params.id;
    const actualizaciones = req.body;
    await db.collection('empleados').doc(empleadoId).update(actualizaciones);
    res.json({ message: 'Empleado actualizado correctamente' });
  } catch (error) {
    console.error('Error updating empleado:', error);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

// ELIMINAR EMPLEADO
router.delete('/:id', async (req, res) => {
  try {
    const docRef = db.collection('empleados').doc(req.params.id);
    const doc = await docRef.get();

    // Verificamos si el documento existe
    if (!doc.exists) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Si existe, lo eliminamos
    await docRef.delete();
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting empleado:', error);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

module.exports = router;
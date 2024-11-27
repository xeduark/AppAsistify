const db = require('../config/firebaseConfig');

// Controlador para obtener empleados
const getEmpleados = async (req, res) => {
  try {
      const empleadosSnapshot = await db.collection('empleados').get();
      const empleados = empleadosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Empleados:', empleados); 
      return res.json({ empleados });
  } catch (error) {
      console.error('Error al obtener empleados:', error);
      return res.status(500).json({ error: 'Error al obtener empleados.' });
  }
};

module.exports = { getEmpleados };
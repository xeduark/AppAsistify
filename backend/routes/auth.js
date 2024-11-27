require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/firebaseConfig');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }

    try {
      const snapshot = await db.collection('administrador')
        .where('correo', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      const adminDoc = snapshot.docs[0];
      const adminData = adminDoc.data();

      if (!adminData.contraseña) {
        console.error('El campo "contraseña" no está definido.');
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }

      const isMatch = await bcrypt.compare(password, adminData.contraseña);
      if (!isMatch) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      const token = jwt.sign(
        { id: adminDoc.id, correo: adminData.correo }, // id del documento
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
      console.error('Error en la autenticación:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');

// Middleware de autenticación (ASÍNCRONO)
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No autorizado' });

    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return res.status(403).json({ message: 'Token inválido: ' + error.message });
    }
};

// Ruta protegida
router.get('/user', authenticateToken, async (req, res) => {
    try {
        // Corrección: Usa req.user.id
        const adminId = req.user.id; 

        const adminDoc = await db.collection('administrador').doc(adminId).get();
        if (!adminDoc.exists) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userData = adminDoc.data();
        res.json({ nombre: userData.nombre, correo: userData.correo });
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener datos del usuario: ' + error.message });
    }
});

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

//Rutas
const  authRoutes = require('./routes/auth'); 
const usuarioRoutes = require('./routes/usuarios');
const empleados = require('./routes/empleados');
const asistencias = require('./routes/asistencias');
const ausencias = require('./routes/ausencias');
const reportes = require('./routes/reportes');
const graficos = require('./routes/graficos');


// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-dominio.com', 'http://127.0.0.1:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/empleados', empleados);
app.use('/api/asistencias', asistencias);
app.use('/api/ausencias', ausencias);
app.use('/api/reportes', reportes);
app.use('/api/generar', graficos);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor de Express funcionando!');
});

// Manejo de errores (ejemplo básico)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error del servidor.' });
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

app.get('/logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'images', 'logo.png'));
});


const db = require('./config/firebaseConfig');
const bcrypt = require('bcryptjs');

const administrador = {
  nombre: "Edward",
  apellido: "Muñoz",
  correo: "xeduark@gmail.com",
  edad: 26,
  contraseña: "xoloeduarkore22",
};

async function insertarAdministrador() {
  try {
    const hashedPassword = await bcrypt.hash(administrador.contraseña, 10);
    const nuevoAdmin = {
      nombre: administrador.nombre,
      apellido: administrador.apellido,
      correo: administrador.correo,
      edad: administrador.edad,
      contraseña: hashedPassword,
    };

    // Aquí está el cambio crucial:  Usar `add()` y obtener el ID generado
    const docRef = await db.collection('administrador').add(nuevoAdmin);
    const adminId = docRef.id; // Obtiene el ID del documento recién creado

    console.log('Administrador insertado con éxito! ID:', adminId); // Imprime el ID

    // ... ahora puedes usar adminId para acceder al documento ...

  } catch (error) {
    console.error('Error al insertar el administrador:', error.message);
  }
}

insertarAdministrador();
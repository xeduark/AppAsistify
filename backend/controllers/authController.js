const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

// Función para manejar el inicio de sesión del admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Lógica de verificación de credenciales del admin
    if (email === 'admin@correo.com' && password === 'administrador123') { // Cambia por tu lógica real
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(401).json({ message: 'Credenciales incorrectas' });
};

module.exports = {
    loginAdmin
};

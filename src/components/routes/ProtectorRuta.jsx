import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Función para comprobar la autenticación, incluyendo la expiración del token
const isAuthenticated = () => {
    const token = localStorage.getItem("autenticacionToken");
    if (token === null) return false;

    try {
        const decodedToken = jwtDecode(token);
        // Comprobación de si el token ha expirado
        const isExpired = decodedToken.exp * 1000 < Date.now(); //Multiplicamos por 1000 porque exp está en segundos y Date.now() devuelve milisegundos.

        return !isExpired;
    } catch (error) {
        // Manejo de errores de decodificación (token inválido)
        console.error("Error decodificando el token:", error);
        return false;
    }
};

// Componente de protección de rutas
const ProtectorRuta = ({ children }) => {
    const authenticated = isAuthenticated();

    return authenticated ? children : <Navigate to="/login" />;
};

export default ProtectorRuta;
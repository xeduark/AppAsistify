import React from "react";
import ProtectorRuta from "./ProtectorRuta";
import Login from '../auth/Login';
import GestionAusencias from "../pages/GestionAusencias";
import GestionAsistencias from "../pages/GestionAsistencias";
import PerfilEmpleado from "../pages/PerfilEmpleado";
import Perfil from "../pages/Perfil";
import RegistroAsistencia from "../pages/RegistroAsistencia";
import Empleados from "../pages/Empleados";
import CrearEmpleado from "../forms/CrearEmpleado";
import EditarEmpleado from "../forms/EditarEmpleado";
import CrearAsistencia from "../forms/CrearAsistencia";
import EditarAsistencia from "../forms/EditarAsistencia";
import CrearAusencia from "../forms/CrearAusencia";
import EditarAusencia from "../forms/EditarAusencias";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";


export let EnrutadorApp = [
    {
        element: <Login />,
        path: "login",
    },
    {
        path: 'registro-asistencia',
        element: <RegistroAsistencia />
    },
    {
        path: "/",
        element: (
            <ProtectorRuta> {/* Proteje el acceso al Dashboard y a sus rutas hijas */}
                <Dashboard />
            </ProtectorRuta>
    ),
        children: [
            {
                path: "gestion-empleados",
                element: <Empleados/>
            },
            {
                path: "crear-empleados",
                element: <CrearEmpleado/>
            },
            {
                path: "/empleados/:id/editar",
                element: <EditarEmpleado/>
            },
            {
                path: 'gestion-ausencias',
                element: <GestionAusencias />
            },
            {
                path: 'perfil-empleado',
                element: <PerfilEmpleado />
            },
            {
                path: 'gestion-asistencias',
                element: <GestionAsistencias />
            },
            {
                path: 'crear-asistencia',
                element: <CrearAsistencia />
            },
            {
                path: 'crear-ausencia',
                element: <CrearAusencia />
            },
            {
                path: '/asistencias/:id/editar',
                element: <EditarAsistencia/>
            },
            {
                path: '/ausencias/:id/editar',
                element: <EditarAusencia/>
            },
            {
                path: 'perfil',
                element: <Perfil />
            },
            {
                path: 'home-graficos',
                element: <Home />
            },
        ]
    },
]
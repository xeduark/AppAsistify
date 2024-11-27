import React from "react";
import Style from './sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { GrHomeRounded } from "react-icons/gr";
import { FaUsers, FaUserSlash, FaUserCheck } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import Swal from "sweetalert2";

const Sidebar = ({ isOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
          title: "¿Estás seguro de que deseas cerrar sesión?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("authenticationToken");
            navigate("/login");
          }
        });
      };

    return (
        <div className={`${Style.sidebar} ${isOpen ? '' : Style.closed}`}>
            <ul>
                <img src="../../../public/images/logo.png" className={Style.logo} alt="logo-Asistify" />
                <hr />
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <GrHomeRounded className={Style.icon}/>Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/gestion-empleados" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <FaUsers className={Style.icon}/>Empleados
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/gestion-ausencias" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <FaUserSlash  className={Style.icon}/>Gestión Ausencias
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/gestion-asistencias" className={({ isActive }) => isActive ? `${Style.links} active` : Style.links}>
                        <FaUserCheck className={Style.icon}/>Gestión Asistencias
                    </NavLink>
                </li>
                <li>
                    <NavLink onClick={handleLogout} className={({ isActive }) => isActive ? `${Style.btnLogout} active` : Style.links}>
                        <CiLogout className={Style.icon}/>Cerrar sesión
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;

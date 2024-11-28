import React, { useState, useEffect } from "react";
import styles from "./detallesEmpleados.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { GrFormViewHide } from "react-icons/gr";

const DetalleEmpleado = () => {
  const { id } = useParams(); // Obtener el ID del empleado de la URL
  const [empleadoID, setEmpleadoID] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [nivelEducativo, setNivelEducativo] = useState("");
  const [carrera, setCarrera] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Obtener el token JWT de localStorage
  const token = localStorage.getItem("autenticacionToken");

  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/empleados/${id}`
        ); //Obtener datos del empleado. Ajusta según tu backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmpleadoID(data.id);
        setNombre(data.nombre);
        setApellido(data.apellido);
        setEdad(data.edad);
        setEmail(data.email);
        setNivelEducativo(data.nivelEducativo);
        setCarrera(data.carrera);
        setCiudad(data.ciudad);
      } catch (error) {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Error al obtener datos",
          text: error.message,
        });
      }
    };

    fetchEmpleado();
  }, [id]);

  return (
    <form className={styles.form}>
      <h2 className={styles.tittle}>
        <GrFormViewHide /> Detalle Empleado
      </h2>
      <div className={styles.container}>
        {/*INICIO DE LA COLUMNA 1*/}
        <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="empleadoID"
              name="empleadoID"
              value={empleadoID}
              className={styles.input}
            />
            <div className={styles.label}>Empleado ID</div>
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="edad"
              name="edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Edad</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="nivelEducativo"
              name="nivelEducativo"
              value={nivelEducativo}
              onChange={(e) => setNivelEducativo(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Nivel Educativo</div>
          </div>
          <div className={styles.formGroup}>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className={styles.input}
          />
          <div className={styles.label}>Ciudad</div>
          </div>
        </div>

        {/*INICIO DE LA COLUMNA 2*/}
        <div className={styles.columnDos}>
          
            <div className={styles.formGroup}>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={styles.input}
              />
              <div className={styles.label}>Nombre</div>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={styles.input}
              />
              <div className={styles.label}>Apellido</div>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <div className={styles.label}>Email</div>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                className={styles.input}
              />
              <div className={styles.label}>Carrera</div>
            </div>
          </div>
        </div>
    </form>
  );
};
export default DetalleEmpleado;

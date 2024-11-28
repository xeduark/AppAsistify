import React, { useState, useEffect } from "react";
import styles from "./editarEmpleado.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const EditarEmpleado = () => {
  const { id } = useParams(); // Obtener el ID del empleado de la URL
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

  // Crea la instancia de Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000, // Duración del Toast (3 segundos)
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  // Función para mostrar un Toast de éxito después de crear una receta
  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Empleado actualizado exitosamente",
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const empleadoActualizado = {
      nombre,
      apellido,
      edad: parseInt(edad, 10),
      email,
      nivelEducativo,
      carrera,
      ciudad,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/empleados/${id}`,
        {
          // URL de tu API para actualizar
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Si necesitas autenticación
          },
          body: JSON.stringify(empleadoActualizado),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Empleado creado:", data);
        // Limpiar los campos y mostrar Toast
        setNombre("");
        setApellido("");
        setEdad("");
        setEmail("");
        setNivelEducativo("");
        setCarrera("");
        setCiudad(""); 
        showSuccessToast();
        navigate("/gestion-empleados");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        Swal.fire({
          icon: "error",
          title: "Error al editar",
          text: "Error al editar el empleado: " + errorData.message,
        });
      }
    } catch (error) {
      console.log("Error editando empleado:", error);
      setError("Error al editar el empleado.");
      Swal.fire({
        icon: "error",
        title: "Error al editar",
        text: "Error al editar el empleado.",
      });
    } finally {
      setLoading(false);
    }
  };

  const ciudades = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Cúcuta",
    "Bucaramanga",
    "Pereira",
    "Santa Marta",
    "Ibagué",
    "Pasto",
    "Manizales",
    "Neiva",
    "Villavicencio",
    "Armenia",
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>
        <MdEdit /> Editar Empleado
      </h2>
      <div className={styles.container}>
        {/*INICIO DE LA COLUMNA 1*/}
        <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Nombre*</div>
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
            <div className={styles.label}>Edad*</div>
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
            <div className={styles.label}>Nivel Educativo*</div>
          </div>

          <select
            type="text"
            id="ciudad"
            name="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className={styles.selectt}
          >
            <option value="">Selecciona una ciudad</option>
            {ciudades.map((ciudadOpcion) => (
              <option key={ciudadOpcion} value={ciudadOpcion}>
                {ciudadOpcion}
              </option>
            ))}
          </select>
            <div className={styles.labelSelect}>Ciudad*</div>
        </div>

        {/*INICIO DE LA COLUMNA 2*/}
        <div className={styles.columnDos}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Apellido*</div>
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
            <div className={styles.label}>Email*</div>
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
            <div className={styles.label}>Carrera*</div>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Actualizar
        </button>
      </div>
    </form>
  );
};
export default EditarEmpleado;

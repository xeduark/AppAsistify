import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./crearAsistencia.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";

const CrearAsistencia = () => {
  const [empleadoID, setEmpleadoID] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Crea la instancia de Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Asistencia creada exitosamente",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const nuevaAsistencia = {
      empleadoID,
      estado,
      fecha,
      horaEntrada: new Date(fecha + "T" + horaEntrada), // Combina fecha y hora
      horaSalida: new Date(fecha + "T" + horaSalida), // Combina fecha y hora
    };

    // Validación del formulario
    if (!empleadoID || !estado || !fecha || !horaEntrada || !horaSalida) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Obtener el token JWT de localStorage (si es necesario)
    //const token = localStorage.getItem("autenticacionToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/asistencias/crear",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`, // Si necesitas autenticación
          },
          body: JSON.stringify(nuevaAsistencia),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Asistencia creada:", data);
        // Limpiar los campos y mostrar Toast
        setEmpleadoID("");
        setEstado("");
        setFecha("");
        setHoraEntrada("");
        setHoraSalida("");
        showSuccessToast();
        navigate("/gestion-asistencias"); // Ajusta la ruta según sea necesario
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al crear la asistencia.");
        Swal.fire({
          icon: "error",
          title: "Error al crear",
          text: "Error al crear la asistencia: " + errorData.message,
        });
      }
    } catch (error) {
      console.error("Error creando asistencia:", error);
      setError("Error al crear la asistencia.");
      Swal.fire({
        icon: "error",
        title: "Error al crear",
        text: "Error al crear la asistencia.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>
        <IoIosAdd /> Crear Asistencia
      </h2>
      <div className={styles.container}>
        <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="empleadoID"
              value={empleadoID}
              onChange={(e) => setEmpleadoID(e.target.value)}
              className={styles.input}
              required
            />
            <label htmlFor="empleadoID" className={styles.label}>
              ID del empleado*
            </label>
          </div>
          <div className={styles.formGroup}>
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={styles.select}
              required
            />
            <label className={styles.labelSelect}>Fecha*</label>
          </div>
          <div className={styles.formGroup}>
            <input
              type="time"
              id="horaSalida"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              className={styles.select}
              required
            />
            <label className={styles.labelSelect}>Hora de salida*</label>
          </div>
        </div>

        <div className={styles.columnDos}>
          <div className={styles.formGroup}>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="Presente">Presente</option>
              <option value="Tardanza">Tardanza</option>
              <option value="Ausente">Ausente</option>
            </select>
            <div className={styles.labelSelect}>Estado*</div>
          </div>
          <div className={styles.formGroup}>
            <input
              type="time"
              id="horaEntrada"
              value={horaEntrada}
              onChange={(e) => setHoraEntrada(e.target.value)}
              className={styles.select}
              required
            />
            <label className={styles.labelSelect}>Hora de entrada*</label>
          </div>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" className={styles.button}>
          Guardar
        </button>
      </div>
    </form>
  );
};

export default CrearAsistencia;

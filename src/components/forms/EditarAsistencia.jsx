import React, { useState, useEffect } from "react";
import styles from "./editarAsistencia.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";


const EditarAsistencia = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Usa los datos de asistencia obtenidos directamente en el estado
  const [empleadoID, setEmpleadoID] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
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
      title: "Asistencia actualizado exitosamente",
    });
  };

  // Obtener el token JWT de localStorage
  const token = localStorage.getItem("autenticacionToken");

  useEffect(() => {
    const obtenerAsistencia = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/asistencias/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! estado: ${response.status}`);
        }
        const data = await response.json();

        setEmpleadoID(data.empleadoID);
        setEstado(data.estado);
        setFecha(data.fecha.split("T")[0]); // Extraer solo la parte "YYYY-MM-DD"
        // Ajustar la extracción de horas
        setHoraEntrada(data.horaEntrada.split(":").slice(0, 2).join(":")); // Asegurar "HH:mm"
        setHoraSalida(data.horaSalida.split(":").slice(0, 2).join(":")); // Asegurar "HH:mm"

      } catch (error) {
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "Error al obtener datos",
          text: error.message,
        });
      }
    };

    obtenerAsistencia();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Formatear la fecha y las horas en formato ISO 8601
      const fechaISO = fecha; // Se supone que ya está en "YYYY-MM-DD"
      const horaEntradaISO = horaEntrada.length === 5 ? `${horaEntrada}:00` : horaEntrada; // "HH:mm:ss"
      const horaSalidaISO = horaSalida.length === 5 ? `${horaSalida}:00` : horaSalida; // "HH:mm:ss"
  
      const response = await fetch(
        `http://localhost:5000/api/asistencias/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            empleadoID,
            estado,
            fecha: fechaISO,
            horaEntrada: horaEntradaISO,
            horaSalida: horaSalidaISO,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `Error HTTP: ${response.status}`;
        throw new Error(errorMessage);
      }
  
      showSuccessToast();
      navigate("/gestion-asistencias");
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Error al editar",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>
        <MdEdit /> Editar Asistencia
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
              <option value="">{}</option>
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
          Actualizar
        </button>
      </div>
    </form>
  );
};

export default EditarAsistencia;

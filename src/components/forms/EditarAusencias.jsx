import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./editarAusencia.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";

const EditarAusencia = () => {
  const [empleadoID, setEmpleadoID] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID de la ausencia desde la URL

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
      title: "Ausencia actualizada exitosamente",
    });
  };


  useEffect(() => {
    const obtenerAusencia = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ausencias/${id}`);
        if (!response.ok) {
          throw new Error(`Error al obtener la ausencia: ${response.status}`);
        }
        const data = await response.json();
        setEmpleadoID(data.empleadoID);
        setFecha(new Date(data.fecha).toISOString().slice(0, 10)); //Convierte fecha a formato ISO
        setTipo(data.tipo);
        setMotivo(data.motivo);
        setEstado(data.estado);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching ausencia:", error);
      }
    };

    if (id) {
      obtenerAusencia();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validación del formulario
    if (!empleadoID || !fecha || !tipo || !motivo || !estado) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const fechaObjeto = new Date(fecha);
    if (isNaN(fechaObjeto.getTime())) {
      setError("Formato de fecha inválido.");
      return;
    }

    const nuevaAusencia = {
      empleadoID,
      fecha: fechaObjeto,
      tipo,
      motivo,
      estado,
    };

    const token = localStorage.getItem("autenticacionToken");

    try {
      const response = await fetch(`http://localhost:5000/api/ausencias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaAusencia),
      });

      if (response.ok) {
        showSuccessToast();
        navigate("/gestion-ausencias");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al actualizar la ausencia.");
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Error al actualizar la ausencia: " + errorData.message,
        });
      }
    } catch (error) {
      console.error("Error actualizando ausencia:", error);
      setError("Error al actualizar la ausencia.");
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Error al actualizar la ausencia.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>
        <IoIosAdd /> Crear Ausencia
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
              type="text"
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className={styles.select}
              required
            />
            <label className={styles.labelSelect}>Motivo*</label>
          </div>
        </div>

        <div className={styles.columnDos}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={styles.select}
              required
            />
            <div className={styles.labelSelect}>Tipo*</div>
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={styles.select}
              required
            />
            <label className={styles.labelSelect}>Estado*</label>
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

export default EditarAusencia;


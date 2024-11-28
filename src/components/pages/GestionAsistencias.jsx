import React, { useState, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import style from "./gestionAsistencias.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const GestionAsistencias = () => {
  const [searchValue, setSearchValue] = useState("");
  const [asistencias, setAsistencias] = useState([]);
  const [filteredAsistencias, setFilteredAsistencias] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("autenticacionToken");

  const exportarExcel = () => {
    const encabezados = ["Empleado ID", "Estado", "Fecha", "Hora Entrada", "Hora Salida"];
    
    // Crea un arreglo con los datos de las asistencias
    const data = filteredAsistencias.map((asistencia) => {
      const formattedDate = formatDate(asistencia.fecha);
      const formattedHoraEntrada = formatDate(asistencia.horaEntrada);
      const formattedHoraSalida = formatDate(asistencia.horaSalida);
      return [
        asistencia.empleadoID || "-",
        asistencia.estado || "-",
        formattedDate ? formattedDate.toLocaleDateString() : "-",
        formattedHoraEntrada ? formattedHoraEntrada.toLocaleTimeString() : "-",
        formattedHoraSalida ? formattedHoraSalida.toLocaleTimeString() : "-"
      ];
    });
  
    // Agregar los encabezados al inicio de los datos
    const exportData = [encabezados, ...data];
  
    // Crear la hoja de Excel a partir de los datos
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");
  
    // Exportar el archivo Excel
    XLSX.writeFile(wb, "asistencias.xlsx");
  };

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
      title: "Asistencia eliminada exitosamente",
    });
  };

  const irCrear = () => {
    navigate("/crear-asistencia");
  };

  const irEditar = (id) => {
    navigate(`/asistencias/${id}/editar`); 
  };

  // Función para alternar la selección de todos los usuarios
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredAsistencias.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  // Función para alternar la selección de un usuario específico
  const toggleSelectUser = (index) => {
    if (selectedUsers.includes(index)) {
      setSelectedUsers(selectedUsers.filter((i) => i !== index)); // Deseleccionar usuario
    } else {
      setSelectedUsers([...selectedUsers, index]); // Seleccionar usuario
    }
  };

  useEffect(() => {
    const obtenerAsistencias = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/asistencias/ver"
        );
        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();

        // Verifica la estructura de los datos antes de asignarlos
        if (!Array.isArray(data) || data.length === 0) {
          setError("La estructura de los datos de la API es inválida.");
          return;
        }

        setAsistencias(data);
        setFilteredAsistencias(data);
      } catch (error) {
        setError(`Error al obtener las asistencias: ${error.message}`);
        console.error("Error fetching asistencias:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerAsistencias();
  }, []);

  const filterAsistenciasById = () => {
    const filtered = asistencias.filter((asistencia) => {
      return (
        asistencia.empleadoID &&
        asistencia.empleadoID.toString().includes(searchValue)
      );
    });
    setFilteredAsistencias(filtered);
  };

  useEffect(() => {
    filterAsistenciasById();
  }, [searchValue, asistencias]);

  const indexOfLastAsistencia = currentPage * rowsPerPage;
  const indexOfFirstAsistencia = indexOfLastAsistencia - rowsPerPage;
  const currentAsistencias = filteredAsistencias.slice(
    indexOfFirstAsistencia,
    indexOfLastAsistencia
  );
  const totalPages = Math.ceil(filteredAsistencias.length / rowsPerPage);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const [datePart, timePart] = dateString.split(",");
        const [day, month, year] = datePart.trim().split("/").map(Number);
        const [hours, minutes, seconds] = timePart
          .trim()
          .split(":")
          .map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      }
      return date;
    } catch (error) {
      console.error("Error parsing date:", error, dateString);
      return null;
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la asistencia de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/asistencias/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Asegúrate de que `token` esté definido
            },
          }
        );
        if (response.ok) {
          showSuccessToast();
          // Actualizar la lista de empleados
          setAsistencias(
            asistencias.filter((asistencia) => asistencia.id !== id)
          );
          setFilteredAsistencias(
            filteredAsistencias.filter((asistencia) => asistencia.id !== id)
          );
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar la asistencia: " + errorData.message,
          });
        }
      } catch (error) {
        console.error("Error eliminando asistencia:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar la asistencia.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={style.container}>
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FaUserCheck /> Asistencias
        </h1>
        <button className={style.btnAdd} onClick={irCrear}>
          <IoIosAdd className={style.icon} />
          Crear
        </button>
        <button className={style.btnImport}>
          <CiImport className={style.icon} />
          Import
        </button>
        <button className={style.btnExport} onClick={exportarExcel}>
          <CiExport className={style.icon} />
          Export
        </button>
      </div>

      <form className={style.searchContainer}>
        <input
          className={style.searchInput}
          type="search"
          placeholder="Buscar por ID de Empleado..."
          aria-label="Buscar"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <span className={style.searchIcon}>
          <CiSearch />
        </span>
      </form>

      <div className={style.containerTable}>
        <Table className={`${style.table} ${style.customTable}`}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>ID Empleado</th>
              <th>Fecha</th>
              <th>Hora de Entrada</th>
              <th>Hora de Salida</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAsistencias.map((asistencia, index) => {
              const formattedDate = formatDate(asistencia.fecha);
              const formattedHoraEntrada = formatDate(asistencia.horaEntrada);
              const formattedHoraSalida = formatDate(asistencia.horaSalida);
              console.log("ID de asistencia:", asistencia.id, "Tipo de dato:", typeof asistencia.id);
              return (
                <tr key={asistencia.id}>
                  <td>
                    <input
                      type="checkbox"
                      className={style.customCheckbox}
                      checked={selectedUsers.includes(index)}
                      onChange={() => toggleSelectUser(index)}
                    />
                  </td>
                  <td>{asistencia.empleadoID || "-"}</td>
                  <td>
                    {formattedDate ? formattedDate.toLocaleDateString() : "-"}
                  </td>
                  <td>
                    {formattedHoraEntrada
                      ? formattedHoraEntrada.toLocaleTimeString()
                      : "-"}
                  </td>
                  <td>
                    {formattedHoraSalida
                      ? formattedHoraSalida.toLocaleTimeString()
                      : "-"}
                  </td>
                  <td>{asistencia.estado || "-"}</td>
                  <td>
                    <button className={style.btnEdit} onClick={() => irEditar(asistencia.id)}>
                      <MdEdit />
                    </button>
                    <button
                      className={style.btnDelete}
                      onClick={() => handleDelete(asistencia.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <div
                  className={`d-flex justify-content-start align-items-center${style.tfootSmall}`}
                >
                  <span className={style.textfoot}>Filas por página:</span>
                  <Form.Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={5} className={style.selectLine}>
                      5
                    </option>
                    <option value={10} className={style.selectLine}>
                      10
                    </option>
                  </Form.Select>
                </div>
              </td>
              <td colSpan="1">
                <div
                  className={`d-flex justify-content-center align-items-center${style.tfootSmall}`}
                >
                  <span>{`${indexOfFirstAsistencia + 1}-${Math.min(
                    indexOfLastAsistencia,
                    filteredAsistencias.length
                  )} de ${filteredAsistencias.length}`}</span>
                </div>
              </td>
              <td colSpan="3">
                <div
                  className={`d-flex justify-content-end align-items-center${style.tfootSmall}`}
                >
                  <Pagination className={style.pestanas}>
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );
};

export default GestionAsistencias;

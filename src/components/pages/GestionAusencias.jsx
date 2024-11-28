import React, { useState, useEffect } from "react";
import { FaUserSlash } from "react-icons/fa"; // 
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import style from "./gestionAusencias.module.css"; // Cambiar a tu archivo de estilos de ausencias
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";

const GestionAusencias = () => {
  const [searchValue, setSearchValue] = useState("");
  const [ausencias, setAusencias] = useState([]);
  const [filteredAusencias, setFilteredAusencias] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("autenticacionToken");


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
      title: "Ausencia eliminada exitosamente",
    });
  };

  const irCrear = () => {
    navigate("/crear-ausencia");
  };

  const irEditar = (id) => {
    navigate(`/ausencias/${id}/editar`);
  };

  // Función para alternar la selección de todos los usuarios
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredAusencias.map((_, index) => index));
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
    const obtenerAusencias = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ausencias/ver");
        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        setAusencias(data);
        setFilteredAusencias(data);
      } catch (error) {
        setError(`Error al obtener las ausencias: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    obtenerAusencias();
  }, []);

  // Filtro por ID del empleado
  const filterAusenciasById = () => {
    setFilteredAusencias(
      ausencias.filter((ausencia) =>
        ausencia.empleadoID?.toString().includes(searchValue)
      )
    );
  };

  useEffect(() => {
    filterAusenciasById();
  }, [searchValue, ausencias]);

  const indexOfLastAusencia = currentPage * rowsPerPage;
  const indexOfFirstAusencia = indexOfLastAusencia - rowsPerPage;
  const currentAusencias = filteredAusencias.slice(
    indexOfFirstAusencia,
    indexOfLastAusencia
  );
  const totalPages = Math.ceil(filteredAusencias.length / rowsPerPage);

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

   // Función para exportar los datos a un archivo Excel
   const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAusencias); // Convierte las ausencias filtradas a una hoja de Excel
    const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
    XLSX.utils.book_append_sheet(wb, ws, "Ausencias"); // Agrega la hoja al libro
    XLSX.writeFile(wb, "ausencias.xlsx"); // Descarga el archivo Excel
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
      text: "Esta acción eliminará la ausencia permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/ausencias/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          showSuccessToast();
          setAusencias(ausencias.filter((ausencia) => ausencia.id !== id));
        }
      } catch (error) {
        console.error("Error eliminando ausencia:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar la ausencia.",
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
          <FaUserSlash  /> Ausencias
        </h1>
        <button className={style.btnAdd} onClick={irCrear}>
          <IoIosAdd className={style.icon} />
          Crear
        </button>
        <button className={style.btnImport}>
          <CiImport className={style.icon} />
          Import
        </button>
        <button className={style.btnExport} onClick={handleExport}>
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
              <th>Tipo</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAusencias.map((ausencia, index) => {
              const formattedDate = formatDate(ausencia.fecha);
              return (
                <tr key={ausencia.id}>
                  <td>
                    <input
                      type="checkbox"
                      className={style.customCheckbox}
                      checked={selectedUsers.includes(index)}
                      onChange={() => toggleSelectUser(index)}
                    />
                  </td>
                  <td>{ausencia.empleadoID}</td>
                  <td>{formattedDate ? formattedDate.toLocaleDateString() : "N/A"}</td>
                  <td>{ausencia.tipo}</td>
                  <td>{ausencia.motivo}</td>
                  <td>{ausencia.estado}</td>
                  <td>
                    <button
                      className={style.btnEdit}
                      onClick={() => irEditar(ausencia.id)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className={style.btnDelete}
                      onClick={() => handleDelete(ausencia.id)}
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
                  <span>{`${indexOfFirstAusencia + 1}-${Math.min(
                    indexOfLastAusencia,
                    filteredAusencias.length
                  )} de ${filteredAusencias.length}`}</span>
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

export default GestionAusencias;

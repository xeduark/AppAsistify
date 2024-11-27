import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrFormViewHide } from "react-icons/gr";
import { Table, Pagination, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import style from "./empleados.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const Empleados = () => {
  const [searchValue, setSearchValue] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Obtener el token JWT de localStorage
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
      title: "Empleado eliminado exitosamente",
    });
  };

  const irCrear = () => {
    navigate("/crear-empleados");
  };

  const irEditar = (id) => {
    navigate(`/empleados/${id}/editar`);
  };

  // Función para alternar la selección de todos los usuarios
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredEmpleados.map((_, index) => index));
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

  // Función para actualizar el valor de búsqueda
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Función para filtrar los usuarios
  const filterEmpleados = () => {
    const filtered = empleados.filter((empleado) =>
      empleado.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredEmpleados(filtered);
  };

  // Efecto para filtrar los usuarios cuando el valor de búsqueda cambia
  useEffect(() => {
    filterEmpleados();
  }, [searchValue, empleados]); //Depende de searchValue y empleados

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/empleados/ver");
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setEmpleados(data);
        setFilteredEmpleados(data);
      } catch (error) {
        setError(error);
        console.error("Error fetching empleados:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerEmpleados();
  }, []);

  const indexOfLastEmpleado = currentPage * rowsPerPage;
  const indexOfFirstEmpleado = indexOfLastEmpleado - rowsPerPage;
  const currentEmpleados = filteredEmpleados.slice(
    indexOfFirstEmpleado,
    indexOfLastEmpleado
  );
  const totalPages = Math.ceil(filteredEmpleados.length / rowsPerPage);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al empleado de forma permanente.",
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
          `http://localhost:5000/api/empleados/${id}`,
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
          setEmpleados(empleados.filter((empleado) => empleado.id !== id));
          setFilteredEmpleados(
            filteredEmpleados.filter((empleado) => empleado.id !== id)
          );
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el empleado: " + errorData.message,
          });
        }
      } catch (error) {
        console.error("Error eliminando empleado:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar al empleado.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={style.container}>
      {/******************ENCABEZADO***************************/}
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FaUsers /> Lista de Empleados
        </h1>
        <button className={style.btnAdd} onClick={irCrear}>
          <IoIosAdd className={style.icon} />
          Crear
        </button>
        <button className={style.btnImport}>
          <CiImport className={style.icon} />
          Import
        </button>
        <button className={style.btnExport}>
          <CiExport className={style.icon} />
          Export
        </button>
      </div>
      {/*************************SEARCH*********************************/}
      <form className={style.searchContainer}>
        <input
          className={style.searchInput}
          type="search"
          placeholder="Buscar Empleado..."
          aria-label="Buscar"
          value={searchValue} // Vincula al input de búsqueda
          onChange={handleSearchChange} // Actualiza el estado del input
        />
        <span className={style.searchIcon}>
          <CiSearch className={style.iconS} />
        </span>
      </form>
      {/*****************Tabla de Empleados **********************/}
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
              <th>Nombre</th>
              <th>Correo</th>
              <th>Nivel Educativo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentEmpleados.map((empleado, index) => (
              <tr key={empleado.id}>
                {/* Usar empleado.id como key */}
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedUsers.includes(index)}
                    onChange={() => toggleSelectUser(index)}
                  />
                </td>
                <td>{empleado.nombre}</td>
                <td>{empleado.email}</td>
                <td>{empleado.nivelEducativo}</td>
                <td>Estado</td>
                <td>
                  <button className={style.btnVer}>
                    <GrFormViewHide />
                  </button>
                  <button
                    className={style.btnEdit}
                    onClick={() => irEditar(empleado.id)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className={style.btnDelete}
                    onClick={() => handleDelete(empleado.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
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
                  <span>{`${indexOfFirstEmpleado + 1}-${Math.min(
                    indexOfLastEmpleado,
                    filteredEmpleados.length
                  )} de ${filteredEmpleados.length}`}</span>
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

export default Empleados;

import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { RiMenu4Fill } from "react-icons/ri";
import Style from "./navbar.module.css";
import Swal from "sweetalert2";

const Navbar = ({ toggleSidebar }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
        localStorage.removeItem("autenticacionToken");
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("autenticacionToken");
        const response = await fetch("http://localhost:5000/api/usuario/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("RTA", response)
        const data = await response.json();
        setUserName(data.nombre); // Actualiza el estado con el nombre
        setUserEmail(data.correo);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <nav className={Style.navbar}>
      <div className={Style.container}>
        <button className={Style.hamburger} onClick={toggleSidebar}>
          <RiMenu4Fill className={Style.iconHam} />
        </button>
        <form className={Style.searchForm} role="search">
          <input
            className={Style.searchInput}
            type="search"
            placeholder="Buscar..."
            aria-label="Search"
          />
          <button className={Style.searchButton} type="submit">
            <CiSearch />
          </button>
        </form>
        <div className={Style.containerNameUser}>
          <p className={Style.userName}>{userName}</p>
        </div>
        {/* Imagen de usuario redonda */}
        <div className={Style.userContainer} onClick={toggleModal}>
          <img
            src="../../../public/images/user.png" // Aquí puedes cambiar el enlace por tu imagen de usuario
            alt="user"
            className={Style.userIcon}
          />
        </div>

        {/* Modal pequeño que se despliega debajo de la imagen */}
        {showModal && (
          <div className={Style.modalContent}>
            <ul className={Style.modalOptions}>
              <p className={Style.mailUser}>{userEmail}</p>
              <hr />
              <li>Perfil</li>
              <li>Configuraciones</li>
              <hr />
              <li className={Style.btnLogout} onClick={handleLogout}>
                Cerrar sesión
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
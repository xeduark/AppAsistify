import { useState } from "react";
import Style from "./login.module.css";
import PopupError from "../popups/PopupError";
import Loader from "../layouts/Loader";
import { FaUser, FaLock, FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  //Estado para la transisición
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //estado para mostrar el modal de error
  const [modalError, setModalError] = useState(false);

  const envioSesion = async (e) => {
    e.preventDefault();
  
    try {
      // Realiza una solicitud POST al backend
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Enviar el correo y contraseña en el cuerpo de la solicitud
      });
  
      if (response.ok) {
        const data = await response.json(); // Decodificar la respuesta
        localStorage.setItem("autenticacionToken", data.token); // Guardar el token en localStorage
        setIsLoading(true);
        setTimeout(() => {
          navigate("/home-graficos"); // Redirigir al dashboard
        }, 1500); // Tiempo de espera en milisegundos (1.5 segundos)

        setTimeout(() => {
          setIsLoading(false);
        }, 2500); // Tiempo de espera en milisegundos (2.5 segundos)
        
      } else {
        // Si la autenticación falla, mostrar modal de error
        setModalError(true);
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setModalError(true); // Mostrar modal de error si ocurre un fallo
    }
  };

  //función para cerrar el modal de error
  const cerrarModalError = () => {
    setModalError(false);
  };

  return (
    <main className={Style.contentMain}>

    <div className={Style.mainContainer}>
    {isLoading && <Loader />}
      {/*/MOSTRAR MODAL ERROR SI ESTA ACTIVADO */}
      {modalError && <PopupError onClose={cerrarModalError} />}
      <div className={Style.backbox}>
        <div className={Style.loginMsg}>
          <div className={Style.textContent}>
            <h1 className={Style.mainTittle}>Bienvenido a Asistify Software</h1>
            <h4 className={Style.mainText}>
              Simplifica la gestión de tu equipo, optimiza el rendimiento.
            </h4>
            <button onClick={() => navigate('/registro-asistencia')} className={Style.mainButton}>Registrar Horarios</button>
          </div>
          <span className={Style.curvaEsquina}></span>
        </div>
      </div>
      {/*FORMULARIO LOGIN */}
      <div className={Style.loginContainer}>
        <div className={Style.screen}>
          <div className={Style.screenContent}>
            <form className={Style.login} onSubmit={envioSesion}>
              <div className={Style.loginField}>
                <span className={Style.loginIcon}>
                  <FaUser />
                </span>
                <input
                  type="email"
                  className={Style.loginInput}
                  placeholder="Usuario / Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // actualiza el estado 'EMAIL' cuando cambia el valor
                  required
                />
              </div>
              <div className={Style.loginField}>
                <span className={Style.loginIcon}>
                  <FaLock />
                </span>
                <input
                  type="password"
                  className={Style.loginInput}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} //actualiza el estado 'PASSWORD' cuando cambia el valor
                  required
                />
              </div>
              <div className={Style.loginField}>
                <Link to="#" className={Style.forgotPass}>
                  Olvidaste tu contraseña?
                </Link>
              </div>
              <button className={Style.loginSubmit}>
                <span>Iniciar Sesión</span>
                <span className={Style.buttonIcon}>
                  <IoIosArrowForward />
                </span>
              </button>
            </form>
            <div className={Style.socialLogin}>
              <h3 className={Style.iconTittle}>Iniciar con</h3>
              <div className={Style.socialIcons}>
                <Link to="#" className={Style.socialLoginIcon}>
                  <FaInstagram />
                </Link>
                <Link to="#" className={Style.socialLoginIcon}>
                  <FaGoogle />
                </Link>
                <Link to="#" className={Style.socialLoginIcon}>
                  <FaFacebookSquare />
                </Link>
              </div>
            </div>
          </div>
          <div className={Style.screenBackground}>
            <span
              className={`${Style.screenBackgroundShape} ${Style.screenBackgroundShape4}`}
            ></span>
            <span
              className={`${Style.screenBackgroundShape} ${Style.screenBackgroundShape3}`}
            ></span>
            <span
              className={`${Style.screenBackgroundShape} ${Style.screenBackgroundShape2}`}
            ></span>
            <span
              className={`${Style.screenBackgroundShape} ${Style.screenBackgroundShape1}`}
            ></span>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Login;

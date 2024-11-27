import React, { useEffect, useState } from 'react';
import styles from './loader.module.css'; // Importa los estilos de CSS Module

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular un tiempo de carga de 3 segundos
    const timer = setTimeout(() => {
      setIsLoading(false); // Cambia el estado para ocultar el loader
    }, 3000);

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonta
  }, []);

  return (
    // Solo mostrar el loader mientras `isLoading` sea true
    isLoading ? (
      <div className={styles.loader}>
        <img
          src="../../../public/images/logo.png"
          alt="Logo"
          className={styles.loaderLogo}
        />
      </div>
    ) : null
  );
};

export default Loader;

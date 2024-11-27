import style from "./dashboard.module.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";

const Dashboard = () => {
  const [abrirMenu, cerrarMenu] = useState(false); //Esto

  const toggleSidebar = () => {
    //Esta constante es, para pasar el hook luego al crear  el menu lateral
    cerrarMenu(!abrirMenu);
  };

  return (
    <main>
      <Navbar toggleSidebar={toggleSidebar} />
        <section className={style.panelControl}>
        <Sidebar isOpen={abrirMenu} />
          <section>
            <Outlet />
          </section>
        </section>
    </main>
  );
};

export default Dashboard;

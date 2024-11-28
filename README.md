# Proyecto: Panel de Control de Asistencia de Empleados

## Planteamiento del Problema

En una empresa con un número significativo de empleados, el Administrador enfrenta serias dificultades para gestionar la asistencia debido a registros manuales y hojas de cálculo. Esta falta de un sistema centralizado provoca errores en el cálculo de horas trabajadas y dificultades en la generación de reportes precisos. La necesidad de un sistema que permita el seguimiento eficiente y preciso de la asistencia se vuelve evidente para optimizar la gestión del personal y facilitar la toma de decisiones.

## Descripción

El **Panel de Control de Asistencia de Empleados** es una aplicación que permite al Administrador gestionar y monitorear la asistencia de los empleados de manera eficiente. La aplicación está diseñada para centralizar el registro de asistencia, ausencias y tardanzas, y facilitar la generación de reportes detallados sobre la asistencia de los empleados.

## Funcionamiento

El Administrador puede realizar las siguientes acciones:

- **Registrar y ajustar entradas y salidas** de los empleados de manera manual o mediante importación de datos.
- **Gestionar y registrar ausencias y tardanzas** de forma centralizada, asegurando que toda la información esté disponible en un solo lugar.
- **Generar reportes de asistencia** en formatos como PDF o Excel, pudiendo personalizar los reportes según sea necesario (mensuales, semanales, etc.).

## Objetivo General

Desarrollar un panel de control para que el Administrador gestione y monitoree la asistencia de los empleados de manera eficiente.

## Objetivos Específicos

- **Registrar y ajustar entradas y salidas** de los empleados.
- **Gestionar y registrar ausencias y tardanzas** de manera centralizada.
- **Generar reportes de asistencia** detallados y exportables.

## Alcance del Proyecto

La aplicación se centrará exclusivamente en la gestión y visualización de la asistencia de los empleados. Solo el Administrador tendrá acceso a la plataforma para registrar, modificar y visualizar la información de asistencia.

## Módulos/Funcionalidades

### 1. Registro de Asistencia

- **Descripción**: Este módulo permite al Administrador registrar y ajustar las entradas y salidas de los empleados.
- **Funcionamiento**: El Administrador puede ingresar manualmente las entradas y salidas de los empleados o modificar registros existentes mediante una interfaz intuitiva.

### 2. Gestión de Ausencias

- **Descripción**: Facilita al Administrador la gestión de ausencias y tardanzas de los empleados.
- **Funcionamiento**: El Administrador puede registrar, aprobar o rechazar solicitudes de ausencia y tardanzas. También puede visualizar un historial de ausencias de cada empleado.

### 3. Generación de Reportes

- **Descripción**: Permite al Administrador generar reportes detallados sobre la asistencia de los empleados.
- **Funcionamiento**: El Administrador puede crear reportes mensuales, semanales o personalizados, y exportarlos en formatos como PDF o Excel. Estos reportes incluirán estadísticas relevantes, como horas trabajadas, ausencias y tardanzas.

## Tecnologías

- **Frontend**: React + Vite y CSS
- **Backend**: Node.js
- **Analítica**: Python
- **Gráficos**: React + ApexCharts
- **Base de Datos**: Firebase
# Inventario: Backend

Este repositorio contiene el backend diseñado para gestionar los inventarios de los servidores de una forma organizada y accesible.

## Características principales
- [x] 🔒 Autenticación JWT
- [x] 🔎 Consulta de empleados
- [x] ➕ Agregar nuevos empleados
- [x]  ✏️ Actualizar información
- [x]  ⛔ Eliminar empleados del la nomina
- [x] 👮 Registro de las acciones de los usuarios

## Tecnologías utilizadas

- **Lenguaje:** Node JS
- **Framework:** Express 
- **Base de datos:** Firestore DataBase

## Instalación

 1. **Clonar el repositorio**
```bash
git clone https://github.com/dannyedison75/Asistify.git
cd backend
```

2. **Configurar el entorno**
   1. Crear archivo ``.env`` basado en ``.env.example``
   2. Configurar las variables de entorno:
      - ``FIREBASE_PROJECT_ID``
      - ``FIREBASE_PRIVATE_KEY``
      - ``FIREBASE_CLIENT_EMAIL``
      - ``JWT_SECRET``


3. **Instalar las dependencias**
```bash
npm install 
```
5. **Iniciar la API**
```bash
npm start
```
## Contribuciones
Si quieres contribuir en el desarrollo, por favor envia un **Pull Request**. Recuerda antes asegurarte que funcione correctamente en local, para intentar entre todos, tener un repositorio limpio y funcional.

## Contacto

**Jorge Eduardo Muñoz Quintero**\
*Desarrollador principal*\
jemunozqui@cesde.net | xeduarkk@gmail.com

**Asistify**\
*Equipo del proyecto*\
proyectosDanny75@gmail.com


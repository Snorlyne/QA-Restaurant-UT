import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Desktop/Administrador/Dashboard";
import Login from "./AuthService/login";
import Bienvenido from "../src/Mobil/bienvenido";
import DashboardMeseros from "./Meseros/DashboardMeseros";
import EmpresaComponent from "./Desktop/Administrador/Empresa/Empresa";
import EmpresaCreateEditComponent from "./Desktop/Administrador/Empresa/EmpresaCE";
import Inventario from "./Desktop/Administrador/Inventario/Inventario";
import CrearProducto from "./Desktop/Administrador/Inventario/CrearProducto";
import GuardarPedidos from "./Meseros/GuardarPedidos";
import ClientesComponent from "./Desktop/Administrador/Cliente/Cliente";
import ClienteCEComponent from "./Desktop/Administrador/Cliente/ClienteCE";
import UsuarioComponent from "./Desktop/Administrador/Usuario/Usuario";
import EmpleadoComponent from "./Desktop/Administrador/Empleado/Empleado";
import EmpleadoCEComponent from "./Desktop/Administrador/Empleado/EmpleadoCE";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/bienvenido" element={<Bienvenido />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="empresas" element={<EmpresaComponent />}>
            <Route path="crear" element={<EmpresaCreateEditComponent />} />
            <Route path="editar/:id" element={<EmpresaCreateEditComponent />} />
          </Route>
          <Route path="inventario" element={<Inventario></Inventario>}>
          <Route path="crearproduc" element={<CrearProducto />} />
          </Route>
          <Route path="clientes" element={<ClientesComponent />}>
            <Route path="crear" element={<ClienteCEComponent />} />
            <Route path="editar/:id" element={<ClienteCEComponent />} />
          </Route>
          <Route path="empleados" element={<EmpleadoComponent />}>
            <Route path="crear" element={<EmpleadoCEComponent />} />
            <Route path="editar/:id" element={<EmpleadoCEComponent />} />
          </Route>
          <Route path="usuario" element={<UsuarioComponent />}></Route>
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/meseros" element={<DashboardMeseros />}></Route>
        <Route path="/GuardarPedidos" element={<GuardarPedidos />}></Route>
      </Routes>
    </Router>
  );
};

export default App;

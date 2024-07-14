import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./Desktop/Administrador/Dashboard";
import Login from "./AuthService/login";
import DashboardMeseros from "./Meseros/DashboardMeseros";
import DashboardMeseros2 from "./Meseros/DashboardMeseros2";
import GuardarPedidos from "./Meseros/GuardarPedidos";
import Unauthorized from "./AuthService/Unauthorized";
import ProtectedRoute from "./AuthService/ProtectedRoute";
import DashboardCajero from "./Desktop/Cajero/DashboardCajero";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard/*"
          element={<ProtectedRoute roles={["Root", "Admin"]} element={<Dashboard />} />}
        />
        <Route
          path="/cajeros/*"
          element={<ProtectedRoute roles={["Cashier"]} element={<DashboardCajero />} />}
        />
        <Route path="/meseros" element={<DashboardMeseros />}></Route>
        <Route path="/meseros2" element={<DashboardMeseros2 />}></Route>
        <Route path="/GuardarPedidos" element={<GuardarPedidos />}></Route>
      </Routes>
    </Router>
  );
};

export default App;

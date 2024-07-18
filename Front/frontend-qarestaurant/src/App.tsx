import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Desktop/Administrador/Dashboard";
import DashboardMeseros from "./Meseros/DashboardMeseros";
import DashboardMeseros2 from "./Meseros/DashboardMeseros2";
import GuardarPedidos from "./Meseros/GuardarPedidos";
import Unauthorized from "./auth/Unauthorized";
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardCajero from "./Desktop/Cajero/DashboardCajero";
import NotFound from "./auth/NotFound";
import Login from "./auth/Login";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={["Root", "Admin"]} element={<Dashboard />} />
          }
        />
        <Route
          path="/cajeros/*"
          element={
            <ProtectedRoute roles={["Cashier"]} element={<DashboardCajero />} />
          }
        />
        <Route
          path="/meseros2"
          element={
            <ProtectedRoute
              roles={["Waiter"]}
              element={<DashboardMeseros2 />}
            />
          }
        ></Route>
        <Route
          path="/GuardarPedidos/:id"
          element={
            <ProtectedRoute roles={["Waiter"]} element={<GuardarPedidos />} />
          }
        ></Route>
        <Route
          path="/GuardarPedidos"
          element={
            <ProtectedRoute roles={["Waiter"]} element={<GuardarPedidos />} />
          }
        ></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

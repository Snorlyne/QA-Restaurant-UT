import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../services/AuthServices";

interface ProtectedRouteProps {
  element: JSX.Element;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roles }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null indica que aún no se ha determinado la autorización
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToUnauthorized, setRedirectToUnauthorized] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    const role = authService.getRole();

    if (!token) {
      Swal.fire({
        title: "Sesión expirada",
        text: "Por favor, inicia sesión de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          container: "custom-swal-container",
          popup: "popup-class",
        },
      }).then(() => {
        setRedirectToLogin(true);
      });
    } else if (!roles.includes(role!)) {
      setRedirectToUnauthorized(true);
    } else {
      setIsAuthorized(true);
    }
  }, [roles]);

  if (redirectToLogin) {
    return <Navigate to="/" />;
  }

  if (redirectToUnauthorized) {
    return <Navigate to="/unauthorized" />;
  }

  return isAuthorized ? element : null; // Muestra el componente solo si está autorizado
};

export default ProtectedRoute;

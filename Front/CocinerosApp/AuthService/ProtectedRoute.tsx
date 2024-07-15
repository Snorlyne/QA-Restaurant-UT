import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RootStackParamList } from '../Navegation/navigationTypes';
import Swal from "sweetalert2";
import authService from "./authservice"; // Asegúrate de que la ruta a authService sea correcta

interface ProtectedRouteProps {
  element: JSX.Element;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roles }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null indica que aún no se ha determinado la autorización
  const [redirectPath, setRedirectPath] = useState<keyof RootStackParamList | null>(null); // Para manejar redirección

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = await authService.getToken();
      const role = await authService.getRole();

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
          setRedirectPath("Login"); // Usamos "Login" en lugar de "login"
        });
      } else if (role && !roles.includes(role)) {
        setRedirectPath("unauthorized");
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuthorization();
  }, [roles]);

  if (redirectPath) {
    const path = redirectPath === "Login" ? "/login" : "/unauthorized";
    return <Navigate to={path} replace />;
  }

  if (isAuthorized === null) {
    return <div>Loading...</div>; // O puedes retornar un indicador de carga personalizado
  }

  return isAuthorized ? element : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;

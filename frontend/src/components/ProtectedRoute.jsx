import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 

  // LOG DE DEPURACIÓN - Revisa esto en la consola (F12)
  console.log("Validando acceso:", { 
    tieneToken: !!token, 
    rolUsuario: user?.rol, 
    rolesPermitidos: allowedRoles 
  });

  // 1. Si no hay token, al login
  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  // 2. Validación de Rol segura (Convertimos ambos a minúsculas para comparar)
  const userRole = user?.rol?.toLowerCase();
  const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (allowedRoles && !isAllowed) {
    return <Navigate to="/" replace />; 
  }

  // 3. Si todo está bien, muestra la página
  return <Outlet />;
};

export default ProtectedRoute;
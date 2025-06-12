import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { AuthContext } from "./AuthContext";
import "./components/Dashboard.css";

// ✅ Importar los componentes de resultado de suscripción
import SubscriptionSuccess from "./components/subscription/SubscriptionSuccess";
import SubscriptionFailure from "./components/subscription/SubscriptionFailure";
import SubscriptionPending from "./components/subscription/SubscriptionPending";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Evitar redirigir si es una de las rutas de Mercado Pago
    const excludedPaths = ["/login", "/register", "/subscription-success", "/subscription-failure", "/subscription-pending"];

    if (!isAuthenticated && !excludedPaths.includes(window.location.pathname)) {
      navigate("/login");
    } else if (
      isAuthenticated &&
      ["/login", "/register"].includes(window.location.pathname)
    ) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      {/* ✅ Rutas públicas (de MP o login) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      <Route path="/subscription-failure" element={<SubscriptionFailure />} />
      <Route path="/subscription-pending" element={<SubscriptionPending />} />

      {/* ✅ Rutas privadas */}
      {isAuthenticated ? (
        <>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;

import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    const decoded = jwtDecode(token);
    setUser(decoded.user);
    setName(decoded.name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setName(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const nowInSeconds = Date.now() / 1000;

        if (decoded.exp && decoded.exp > nowInSeconds) {
          setIsAuthenticated(true);
          setUser(decoded.user);
          setName(decoded.name);
        } else {
          logout(); // Token expirado
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout(); // Token inválido
      }
    } else {
      logout(); // No hay token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

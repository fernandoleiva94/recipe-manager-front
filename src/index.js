import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css"; // Asegúrate de importar Ant Design correctamente
import "./index.css";
import Login from "./Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
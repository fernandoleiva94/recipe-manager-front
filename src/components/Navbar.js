import React, { useState, useContext } from "react";
import { LogoutOutlined, FileOutlined, PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const { Sider } = Layout;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout(); // actualiza el estado y redirige automáticamente
    } else {
      const routes = {
        "1": "/dashboard/insumos",
        "2-1": "/dashboard/recetas/crear",
        "2-2": "/dashboard/recetas/ver",
        "3-1": "/dashboard/platos/crear",
        "3-2": "/dashboard/platos/ver",
        "3-3": "/dashboard/platos/lista",
        "4-1": "/dashboard/configuracion/categorias",
      };

      if (routes[key]) {
        navigate(routes[key]);
      }
    }
  };

  const items = [
    {
      key: "1",
      icon: <FileOutlined />,
      label: "Insumos",
    },
    {
      key: "2",
      icon: <PieChartOutlined />,
      label: "Recetas",
      children: [
        { key: "2-1", label: "Crear Recetas" },
        { key: "2-2", label: "Ver Recetas" },
      ],
    },
    {
      key: "3",
      icon: <FileOutlined />,
      label: "Platos",
      children: [
        { key: "3-1", label: "Crear Platos" },
        { key: "3-2", label: "Ver Platos" },
        { key: "3-3", label: "Lista de productos" }
      ],
    },
    {
      key: "4",
      icon: <FileOutlined />,
      label: "Configuraciones",
      children: [
        { key: "4-1", label: "Categorías ABM" },
      ],
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      danger: true,
    },
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" items={items} onClick={handleMenuClick} />
    </Sider>
  );
};

export default Navbar;

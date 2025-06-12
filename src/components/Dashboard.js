// Dashboard.jsx
import React, { useContext, useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import Insumos from "./Insumos";
import Recetas from "./Recetas";
import Platos from "./Plato";
import RecetasList from "./RecetasList";
import PlatosList from "./PlatosList";
import Categorias from "./Categorias";
import PlatosListExport from "./PlatosListExport";
import EditRecipe from "./EditRecipe";
import Perfil from "./UserProfile";
import AvailablePlans from "./AvailablePlans"
import { AuthContext } from "../AuthContext";

const { Header, Footer, Sider } = Layout;

// Componente reutilizable para mostrar la info del usuario
const UserInfo = () => {
  const { name, user } = useContext(AuthContext);
  return (
    <div style={{ marginRight: "16px" }}>
      Bienvenido, <strong>{name}</strong> ({user})
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Barra lateral */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        style={{ background: "#001529" }}
      >
        <div
          style={{
            height: "32px",
            margin: "16px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
            textAlign: "center",
            color: "#fff",
            lineHeight: "32px",
            fontWeight: "bold",
          }}
        >
          Menú
        </div>
        <nav>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
          >
            <Menu.Item key="/dashboard/insumos" icon={<DatabaseOutlined />}>
              <Link to="/dashboard/insumos">Insumos</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/recetas/crear" icon={<FileTextOutlined />}>
              <Link to="/dashboard/recetas/crear">Crear Producto</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/recetas/ver" icon={<FileTextOutlined />}>
              <Link to="/dashboard/recetas/ver">Ver Productos</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/platos/crear" icon={<AppstoreOutlined />}>
              <Link to="/dashboard/platos/crear">Crear Productos Final</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/platos/ver" icon={<AppstoreOutlined />}>
              <Link to="/dashboard/platos/ver">Ver Productos Finales</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/platos/lista" icon={<AppstoreOutlined />}>
              <Link to="/dashboard/platos/lista">Lista de Productos Finales</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/configuracion/categorias" icon={<SettingOutlined />}>
              <Link to="/dashboard/configuracion/categorias">Categorías</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/configuracion/perfil" icon={<SettingOutlined />}>
              <Link to="/dashboard/configuracion/perfil">Mi Perfil</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/planes" icon={<SettingOutlined />}>
              <Link to="/dashboard/planes">Planes</Link>
            </Menu.Item>
          </Menu>
        </nav>
      </Sider>

      {/* Panel principal */}
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "20px" }}>Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserInfo />
            <Button type="primary" danger onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </Header>

        <main style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Routes>
              <Route path="/insumos" element={<Insumos />} />
              <Route path="/recetas/crear" element={<Recetas />} />
              <Route path="/recetas/ver" element={<RecetasList />} />
              <Route path="/platos/crear" element={<Platos />} />
              <Route path="/platos/ver" element={<PlatosList />} />
              <Route path="/platos/lista" element={<PlatosListExport />} />
              <Route path="/configuracion/categorias" element={<Categorias />} />
              <Route path="/configuracion/perfil" element={<Perfil />} />
              <Route path="/planes" element={<AvailablePlans />} />
              <Route path="/recetas/editar/:id" element={<EditRecipe />} />
            </Routes>
          </div>
        </main>

        <Footer style={{ textAlign: "center" }}>
          FoodStation ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

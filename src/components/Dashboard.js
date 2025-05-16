import React from "react";
import { Layout } from "antd";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Insumos from "./Insumos";
import Recetas from "./Recetas";
import Platos from "./Plato";
import RecetasList from "./RecetasList";
import PlatosList from "./PlatosList";
import Categorias from "./Categorias";
import PlatosListExport from "./PlatosListExport";

const { Header, Content, Footer } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: "16px", padding: 24, background: "#fff", borderRadius: "8px" }}>
          <Routes>
            <Route path="/insumos" element={<Insumos />} />
            <Route path="/recetas/crear" element={<Recetas />} />
            <Route path="/recetas/ver" element={<RecetasList />} />
            <Route path="/platos/crear" element={<Platos />} />
            <Route path="/platos/ver" element={<PlatosList />} />
            <Route path="/platos/lista" element={<PlatosListExport />} />
            <Route path="/configuracion/categorias" element={<Categorias />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />

          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

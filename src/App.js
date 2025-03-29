import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Insumos from './components/Insumos';
import Recetas from './components/Recetas';
import './App.css'; // Importa tus estilos CSS
import '../node_modules/antd/dist/reset.css';
import RecetasList from './components/RecetasList';
import EditReceta from './components/EditReceta';
import Plato from './components/Plato';
import PlatosList from './components/PlatosList';
import Categorias from './components/Categorias';

const { Header, Content, Footer } = Layout;

const App = () => {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Navbar />
                <Layout>
                    <Header style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: '#fff',
                                borderRadius: '8px',
                            }}
                        >
                            <Routes>
                               <Route path="/insumos" element={<Insumos />} />
                                <Route path="/recetas" element={<Recetas />} />
                                <Route path="/recetas/ver" element={<RecetasList />} />
                                <Route path="/recetas/editar/:id" element={<EditReceta />} />
                                <Route path="/platos" element={<Plato />} />
                                <Route path="/platos/ver" element={<PlatosList />} />
                                <Route path="/configuracion/categorias" element={<Categorias />} />
                                {/* Otras rutas */}
                            </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </Router>
    );
};

export default App;

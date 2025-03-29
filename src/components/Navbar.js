import React, { useState } from 'react';
import {    
    FileOutlined,
    PieChartOutlined,  
    
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Navbar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const items = [      
        {
            key: '3',
            icon: <FileOutlined />,
            label: <Link to="/insumos">Insumos</Link>,
        },
        {
            key: '4',
            icon: <PieChartOutlined />,
            label: 'Recetas',
            children: [
                {
                    key: '5',
                    label: <Link to="/recetas">Crear Recetas</Link>,
                },
                {
                    key: '6',
                    label: <Link to="/recetas/ver">Ver Recetas</Link>,
                },
            ],
        },
        {
            key: '7',
            icon: <FileOutlined />,
            label: <Link to="/plato">Platos</Link>,
            children: [
                {
                    key: '8',
                    label: <Link to="/platos">Crear Platos</Link>,
                },
                {
                    key: '9',
                    label: <Link to="/platos/ver">Ver Platos</Link>,
                },
            ],
        },
        {
            key: '10',
            icon: <FileOutlined />,
            label: <Link to="/configuracion">configuaiciones</Link>,
            children: [
                {
                    key: '11',
                    label: <Link to="/configuracion/categorias">Categorias ABM</Link>,
                },
            ],
        },    
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            theme="dark"
        >
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
    );
};

export default Navbar;

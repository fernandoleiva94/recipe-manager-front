import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, InputNumber, Select, message } from 'antd';
import axiosInstance from '../Axios'; // Asegúrate de que la ruta sea correcta
import './FormularioInsumo.css'; // Estilo personalizado para Insumos

const { Option } = Select;

const Insumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [filteredInsumos, setFilteredInsumos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentInsumo, setCurrentInsumo] = useState(null);
    const [categories, setCategories] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        fetchInsumos();
        fetchCategories(); // Obtener las categorías al cargar el componente
    }, []);

    const fetchInsumos = () => {
        axiosInstance.get('/api/supplies')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setInsumos(response.data);
                    setFilteredInsumos(response.data);
                } else {
                    setInsumos([]);
                    setFilteredInsumos([]);
                }
            })
            .catch(error => {
                message.error('Error al obtener los insumos.');
                setInsumos([]);
                setFilteredInsumos([]);
            });
    };

    const fetchCategories = () => {
        axiosInstance.get('/api/categories') // Obtener categorías
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    setCategories([]);
                }
            })
            .catch(error => {
                message.error('Error al obtener las categorías.');
            });
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = insumos.filter(insumo =>
            insumo.name.toLowerCase().includes(term)
        );
        setFilteredInsumos(filtered);
    };

    const handleOpenModal = (insumo) => {
        setIsModalVisible(true);
        setIsEditing(!!insumo);
        setCurrentInsumo(insumo || null);

        if (insumo) {
            form.setFieldsValue(insumo);
        } else {
            form.resetFields();
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: '¿Estás seguro de eliminar este insumo?',
            onOk: () => {
                axiosInstance.delete(`/api/supplies/${id}`)
                    .then(() => {
                        fetchInsumos();
                        message.success('Insumo eliminado.');
                    })
                    .catch(error => message.error('Error al eliminar el insumo.'));
            }
        });
    };

    const handleModalSubmit = () => {
        form.validateFields().then(values => {
            const payload = {
                ...values,
                category: { id: values.category } // Convertir categoría a objeto con id
            };
    
            if (isEditing) {
                axiosInstance.put(`/api/supplies/${currentInsumo.id}`, payload)
                    .then(() => {
                        fetchInsumos();
                        message.success('Insumo actualizado.');
                        setIsModalVisible(false);
                    })
                    .catch(error => message.error('Error al actualizar insumo.'));
            } else {
                axiosInstance.post('/api/supplies', payload)
                    .then(() => {
                        fetchInsumos();
                        message.success('Insumo agregado.');
                        setIsModalVisible(false);
                    })
                    .catch(error => message.error('Error al agregar insumo.'));
            }
        });
    };

    const columns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Unidad', dataIndex: 'unit', key: 'unit' },
        { title: 'Precio', dataIndex: 'price', key: 'price', render: text => `$${parseFloat(text).toFixed(2)}` },
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        { title: 'Categoría', dataIndex: 'category', key: 'category', render: category => category ? category.description : '' }, // Mostrar descripción de la categoría
        { title: 'Merma (%)', dataIndex: 'wastage', key: 'wastage' },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="primary" onClick={() => handleOpenModal(record)}>Editar</Button>
                    <Button type="danger" onClick={() => handleDelete(record.id)}>Eliminar</Button>
                </div>
            )
        }
    ];

    return (
        <div className="insumos-container">
            <div className="insumos-header">
                <Input
                    placeholder="Buscar insumo"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ flex: 1 }}
                />
                <Button
                    type="primary"
                    onClick={() => handleOpenModal(null)}
                    style={{ marginLeft: '20px' }}
                >
                    Agregar Insumo
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredInsumos}
                rowKey="id"
                pagination={false}
                scroll={{ y: 'calc(100vh - 260px)' }} // Ajusta la altura automáticamente
            />
            <Modal
                title={isEditing ? 'Editar Insumo' : 'Agregar Insumo'}
                visible={isModalVisible}
                onOk={handleModalSubmit}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Cantidad" name="quantity" rules={[{ required: true, message: 'Por favor ingresa la cantidad' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Unidad" name="unit" rules={[{ required: true }]}>
                        <Select>
                            <Option value="gr">Gramo</Option>
                            <Option value="unidad">Unidad</Option>
                            <Option value="ml">Mililitro</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Precio" name="price" rules={[{ required: true, message: 'Por favor ingresa el precio' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
                    </Form.Item>
                    <Form.Item label="Descripción" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Categoría" name="category" rules={[{ required: true }]}>
                        <Select placeholder="Selecciona una categoría">
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.description}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Merma (%)" name="wastage" rules={[{ required: true, message: 'Por favor ingresa el porcentaje de merma' }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Insumos;

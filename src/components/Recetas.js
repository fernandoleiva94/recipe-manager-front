import React, { useState, useEffect } from 'react';
import { Input, Table, Button, Form, InputNumber, message, Modal, Select, Row, Col, Typography, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../Axios';
import './FormularioReceta.css';

const { Option } = Select;
const { Title } = Typography;

const Recetas = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);

    const [recipe, setRecipe] = useState({
        name: '',
        unit: '',
        quantity: '',
        description: '',
        ingredients: []
    });

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axiosInstance.get('/api/supplies')
            .then(response => {
                setIngredients(response.data);
                setFilteredIngredients(response.data);
            })
            .catch(() => message.error('Error al obtener ingredientes'));
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(term)
        );
        setFilteredIngredients(filtered);
    };

    const showModal = () => setIsModalVisible(true);

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);
        setIsModalVisible(false);
        setIsQuantityModalVisible(true);
    };

    const handleAddIngredient = () => {
        if (!selectedIngredient || !quantity) {
            message.warning('Por favor selecciona un ingrediente y una cantidad');
            return;
        }

        const existing = recipe.ingredients.find(i => i.id === selectedIngredient.id);
        const costKg = (selectedIngredient.price / selectedIngredient.quantity).toFixed(2);
        const newIngredient = {
            ...selectedIngredient,
            quantity,
            cost: (costKg * quantity).toFixed(2),
            costKg: parseFloat(costKg)
        };

        setRecipe(prev => ({
            ...prev,
            ingredients: existing
                ? prev.ingredients.map(i => i.id === newIngredient.id ? newIngredient : i)
                : [...prev.ingredients, newIngredient]
        }));

        setSelectedIngredient(null);
        setQuantity('');
        setIsQuantityModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedIngredient(null);
        setQuantity('');
    };

    const handleRemoveIngredient = (id) => {
        setRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter(i => i.id !== id)
        }));
    };

    const handleSubmit = () => {
        const costTotal = recipe.ingredients.reduce((sum, ing) => sum + parseFloat(ing.cost), 0).toFixed(2);

        const postData = {
            name: recipe.name,
            unit: recipe.unit,
            quantity: recipe.quantity,
            costTotal: parseFloat(costTotal),
            description: recipe.description || '',
            ingredients: recipe.ingredients.map(i => ({
                supplyId: i.id,
                quantity: i.quantity,
                costKg: i.costKg
            }))
        };

        axiosInstance.post('/api/recipes', postData)
            .then(() => {
                message.success('Receta guardada con éxito');
                resetForm();
            })
            .catch(() => message.error('Error al guardar la receta'));
    };

    const resetForm = () => {
        setRecipe({
            name: '',
            unit: '',
            quantity: '',
            description: '',
            ingredients: []
        });
        setSelectedIngredient(null);
        setQuantity('');
    };

    const isFormValid = recipe.name && recipe.unit && recipe.quantity && recipe.ingredients.length > 0;

    const ingredientColumns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Unidad', dataIndex: 'unit', key: 'unit' },
        { title: 'Precio', dataIndex: 'price', key: 'price', render: text => parseFloat(text).toFixed(2) },
        { title: 'Stock', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Acción',
            key: 'select',
            render: (_, record) => (
                <Button type="link" icon={<PlusOutlined />} onClick={() => handleSelectIngredient(record)}>
                    Agregar
                </Button>
            )
        }
    ];

    const addedIngredientsColumns = [
        { title: 'Ingrediente', dataIndex: 'name', key: 'name' },
        { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Unidad', dataIndex: 'unit', key: 'unit' },
        { title: 'Costo', dataIndex: 'cost', key: 'cost', render: text => parseFloat(text).toFixed(2) },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Button danger type="link" icon={<DeleteOutlined />} onClick={() => handleRemoveIngredient(record.id)}>
                    Eliminar
                </Button>
            )
        }
    ];

    return (
        <div className="recetas-container">
            <Title level={3} style={{ textAlign: 'center' }}>Gestión de Recetas</Title>
            <Row gutter={24}>
                {/* Formulario de Receta */}
                <Col xs={24} md={12}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Nombre de la Receta" required>
                            <Input
                                value={recipe.name}
                                onChange={e => setRecipe({ ...recipe, name: e.target.value })}
                            />
                        </Form.Item>

                        <Form.Item label="Unidad" required>
                            <Select
                                value={recipe.unit}
                                onChange={value => setRecipe({ ...recipe, unit: value })}
                                placeholder="Selecciona unidad"
                            >
                                <Option value="gr">Gramos</Option>
                                <Option value="ml">Mililitros</Option>
                                <Option value="unidad">Unidad</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Cantidad Total" required>
                            <InputNumber
                                value={recipe.quantity}
                                onChange={value => setRecipe({ ...recipe, quantity: value })}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Descripción (opcional)">
                            <Input.TextArea
                                value={recipe.description}
                                onChange={e => setRecipe({ ...recipe, description: e.target.value })}
                                rows={3}
                                maxLength={500}
                            />
                        </Form.Item>

                        <Space style={{ marginTop: 16 }}>
                            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
                                Agregar Ingredientes
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!isFormValid}
                            >
                                Guardar Receta
                            </Button>

                            <Button onClick={resetForm}>
                                Limpiar
                            </Button>
                        </Space>
                    </Form>
                </Col>

                {/* Ingredientes Agregados */}
                <Col xs={24} md={12}>
                    <Title level={5}>Ingredientes en la Receta</Title>
                    <Table
                        columns={addedIngredientsColumns}
                        dataSource={recipe.ingredients}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        scroll={{ y: 300 }}
                        bordered
                    />
                </Col>
            </Row>

            {/* Modal para seleccionar Ingredientes */}
            <Modal
                title="Seleccionar Ingrediente"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width="70%"
            >
                <Input
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Busca un ingrediente"
                    style={{ marginBottom: 12 }}
                />
                <Table
                    columns={ingredientColumns}
                    dataSource={filteredIngredients}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    scroll={{ y: 300 }}
                />
            </Modal>

            {/* Modal para ingresar cantidad */}
            <Modal
                title="Cantidad"
                visible={isQuantityModalVisible}
                onOk={handleAddIngredient}
                onCancel={() => setIsQuantityModalVisible(false)}
                okText="Agregar"
                cancelText="Cancelar"
                centered
            >
                <Form.Item label="Cantidad">
                    <InputNumber
                        value={quantity}
                        onChange={setQuantity}
                        min={1}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
};

export default Recetas;

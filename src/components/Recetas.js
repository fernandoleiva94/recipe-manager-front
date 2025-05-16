import React, { useState, useEffect } from 'react';
import { Input, Table, Button, Form, InputNumber, message, Modal, Select } from 'antd';
import axiosInstance from '../Axios';
import './FormularioReceta.css';

const { Option } = Select;

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
            message.error('Por favor selecciona un ingrediente y una cantidad');
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
                message.success('Receta guardada');
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
        { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Seleccionar',
            key: 'select',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleSelectIngredient(record)}>Seleccionar</Button>
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
                <Button type="danger" onClick={() => handleRemoveIngredient(record.id)}>Eliminar</Button>
            )
        }
    ];

    return (
        <div className="recetas-container">
            <Form layout="vertical" onFinish={handleSubmit}>
                <h2>Crear Receta</h2>

                <Form.Item label="Nombre de la Receta" required>
                    <Input
                        value={recipe.name}
                        onChange={e => setRecipe({ ...recipe, name: e.target.value })}
                        style={{ width: '30%' }}
                    />
                </Form.Item>

                <Form.Item label="Unidad" required>
                    <Select
                        value={recipe.unit}
                        onChange={value => setRecipe({ ...recipe, unit: value })}
                        placeholder="Selecciona unidad"
                        style={{ width: '30%' }}
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
                        placeholder="Cantidad total de la receta"
                        min={1}
                        style={{ width: '30%' }}
                    />
                </Form.Item>

                <Form.Item label="Descripción (opcional)">
                    <Input.TextArea
                        value={recipe.description}
                        onChange={e => setRecipe({ ...recipe, description: e.target.value })}
                        rows={4}
                        maxLength={500}
                        style={{ width: '60%' }}
                    />
                </Form.Item>

                <Button type="primary" onClick={showModal}>
                    Seleccionar Ingredientes
                </Button>

                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginTop: '20px', marginLeft: '20px' }}
                    disabled={!isFormValid}
                >
                    Guardar Receta
                </Button>
            </Form>

            <div style={{ textAlign: 'center' }}>
                <h3>Ingredientes Agregados</h3>
            </div>

            <Table
                columns={addedIngredientsColumns}
                dataSource={recipe.ingredients}
                rowKey="id"
                pagination={false}
                scroll={{ y: 'calc(100vh - 500px)' }}
                style={{ margin: '0 auto', width: '80%' }}
            />

            {/* Modal Selección Ingrediente */}
            <Modal
                title="Seleccionar Ingrediente"
                visible={isModalVisible}
                onOk={handleAddIngredient}
                onCancel={handleModalCancel}
                width="100%"
            >
                <Form.Item label="Buscar Ingrediente">
                    <Input
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Busca un ingrediente"
                    />
                </Form.Item>

                <Table
                    columns={ingredientColumns}
                    dataSource={filteredIngredients}
                    rowKey="id"
                    pagination={false}
                    scroll={{ y: 200 }}
                />
            </Modal>

            {/* Modal Cantidad Ingrediente */}
            <Modal
                title="Cantidad"
                visible={isQuantityModalVisible}
                onOk={handleAddIngredient}
                onCancel={() => setIsQuantityModalVisible(false)}
                width="20%"
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

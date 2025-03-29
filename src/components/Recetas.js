import React, { useState, useEffect } from 'react';
import { Input, Table, Button, Form, InputNumber, message, Modal } from 'antd';
import axiosInstance from '../Axios'; // Asegúrate de que la ruta sea correcta
import './FormularioReceta.css'; // Estilos personalizados

const Recetas = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState(null); // Ingrediente seleccionado
    const [quantity, setQuantity] = useState(''); // Cantidad ingresada
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal para seleccionar insumos
    const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false); // Modal para ingresar cantidad
    const [recipe, setRecipe] = useState({
        name: '',
        ingredients: []
    });
    const [totalGrams, setTotalGrams] = useState(0);
    const [finalWeight, setFinalWeight] = useState('');
    const [portions, setPortions] = useState('');

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axiosInstance.get('/api/supplies')
            .then(response => {
                setIngredients(response.data);
                setFilteredIngredients(response.data);
            })
            .catch(error => message.error('Error fetching ingredients'));
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(term)
        );
        setFilteredIngredients(filtered);
    };

    const showModal = () => {
        setIsModalVisible(true); // Mostrar modal con la tabla de insumos
    };

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient); // Guardamos el ingrediente seleccionado
        setIsModalVisible(false); // Cerrar el modal de selección de insumos
        setIsQuantityModalVisible(true); // Mostrar el modal de cantidad
    };

    const handleAddIngredient = () => {
        // Validar que haya un ingrediente seleccionado y una cantidad ingresada
        if (!selectedIngredient || !quantity) {
            message.error('Por favor selecciona un ingrediente y una cantidad');
            return; // Salir si no se ha seleccionado el ingrediente o cantidad
        }

        const existingIngredient = recipe.ingredients.find(ingredient => ingredient.id === selectedIngredient.id);

        const addIngredient = () => {
            const cost = ((selectedIngredient.price / selectedIngredient.quantity) * quantity).toFixed(2); // Formato a 2 decimales
            const newIngredient = { ...selectedIngredient, quantity, cost };

            // Si el ingrediente ya está, lo reemplaza
            if (existingIngredient) {
                setRecipe(prevState => ({
                    ...prevState,
                    ingredients: prevState.ingredients.map(ingredient =>
                        ingredient.id === newIngredient.id ? newIngredient : ingredient
                    )
                }));
            } else {
                setRecipe(prevState => ({
                    ...prevState,
                    ingredients: [...prevState.ingredients, newIngredient]
                }));
            }

            if (selectedIngredient.unit === 'gr') {
                setTotalGrams(prevGrams => prevGrams + parseFloat(quantity));
            }

            setSelectedIngredient(null); // Limpiar selección
            setQuantity(''); // Resetear cantidad
            setIsQuantityModalVisible(false); // Cerrar el modal de cantidad
        };

        addIngredient();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false); // Cerrar el modal de insumos
        setSelectedIngredient(null); // Limpiar selección
        setQuantity(''); // Resetear cantidad
    };

    const handleRemoveIngredient = (id) => {
        setRecipe(prevState => ({
            ...prevState,
            ingredients: prevState.ingredients.filter(ingredient => ingredient.id !== id)
        }));
    };

    const handleSubmit = () => {
        const costTotal = recipe.ingredients.reduce((total, ingredient) => total + parseFloat(ingredient.cost), 0).toFixed(2); // Formato a 2 decimales

        const postData = {
            name: recipe.name,
            portion: portions,
            weightFinal: finalWeight,
            costTotal: costTotal,
            recipeSuppliesDto: recipe.ingredients.map(ingredient => ({
                supplyId: ingredient.id,
                quantity: ingredient.quantity                
            })) 
        };

        axiosInstance.post('/api/recipes', postData)
            .then(() => {
                message.success('Receta guardada');
                resetForm();
            })
            .catch(error => message.error('Error al guardar la receta'));
    };

    const resetForm = () => {
        setRecipe({ name: '', ingredients: [] });
        setSelectedIngredient(null);
        setQuantity('');
        setTotalGrams(0);
        setFinalWeight('');
        setPortions('');
    };

    const ingredientColumns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Unidad', dataIndex: 'unit', key: 'unit' },
        { title: 'Precio', dataIndex: 'price', key: 'price', render: (text) => parseFloat(text).toFixed(2) },
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
        { title: 'Costo', dataIndex: 'cost', key: 'cost', render: (text) => parseFloat(text).toFixed(2) },
        {
            title: 'Acción',
            key: 'action',
            render: (_, record) => (
                <Button type="danger" onClick={() => handleRemoveIngredient(record.id)}>
                    Eliminar
                </Button>
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
                <Form.Item label="Peso Final Cocido (gramos)">
                    <InputNumber
                        value={finalWeight}
                        onChange={value => setFinalWeight(value)}
                        placeholder="Ingresa el peso final cocido"
                        style={{ width: '30%' }}
                    />
                </Form.Item>
                <Form.Item label="Número de Porciones">
                    <InputNumber
                        value={portions}
                        onChange={value => setPortions(value)}
                        placeholder="Ingresa el número de porciones"
                        style={{ width: '30%' }}
                    />
                </Form.Item>

                <Button type="primary" onClick={showModal}>
                    Seleccionar Ingredientes
                </Button>

                <Button type="primary" htmlType="submit" style={{ marginTop: '20px' }}>
                    Guardar Receta
                </Button>
            </Form>

            <div style={{ textAlign: 'center' }}>
                <h3>Total Gramos: {totalGrams.toFixed(2)} gr</h3>
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

            {/* Modal de Selección de Ingredientes */}
            <Modal
                title="Seleccionar Ingrediente"
                visible={isModalVisible}
                onOk={handleAddIngredient}
                onCancel={handleModalCancel}
                width="100%" // Ancho del modal de insumos (más grande)
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
                    scroll={{ y: 200 }} // 5 registros visibles y luego scroll
                />
            </Modal>

            {/* Modal de Cantidad */}
            <Modal
                title="Cantidad"
                visible={isQuantityModalVisible} // Controlar la visibilidad del modal de cantidad
                onOk={handleAddIngredient}
                onCancel={() => setIsQuantityModalVisible(false)}
                width="10%" // Modal más pequeño
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
import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Modal, InputNumber, message, Form } from 'antd';
import axiosInstance from '../util/RecipeAxios';
import './FormularioPlato.css';

const Plato = () => {
  const [recipes, setRecipes] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [plato, setPlato] = useState({ name: '', description: '', profitMargin: 0 });
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [selectType, setSelectType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
    fetchSupplies();
  }, []);

  const fetchRecipes = () => {
    axiosInstance.get('/api/recipes')
      .then(response => setRecipes(response.data))
      .catch(() => message.error('Error al obtener productos'));
  };

  const fetchSupplies = () => {
    axiosInstance.get('/api/supplies')
      .then(response => setSupplies(response.data))
      .catch(() => message.error('Error al obtener insumos'));
  };

  const openSelectModal = (type) => {
    setSelectType(type);
    setIsSelectModalVisible(true);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsSelectModalVisible(false);
    setQuantity(1);
    setIsQuantityModalVisible(true);
  };

  const handleAddSelectedItem = () => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, selectedQuantity: quantity };
      if (selectType === 'recipe') {
        setSelectedRecipes([...selectedRecipes, updatedItem]);
      } else if (selectType === 'supply') {
        setSelectedSupplies([...selectedSupplies, updatedItem]);
      } 
    }
    setSelectedItem(null);
    setQuantity(1);
    setIsQuantityModalVisible(false);
  };

  const handleSubmit = () => {
    const payload = {
      name: plato.name,
      description: plato.description,
      supplies: selectedSupplies.map(supply => ({ id: supply.id, quantity: supply.selectedQuantity })),
      recipes: selectedRecipes.map(recipe => ({ id: recipe.id, quantity: recipe.selectedQuantity })),
      profitMargin: plato.profitMargin,
    };

    axiosInstance.post('/api/dishes', payload)
      .then(() => {
        message.success('Profucto creado correctamente');
        resetForm();
      })
      .catch(() => message.error('Error al crear el producto'));
  };

  const resetForm = () => {
    setPlato({ name: '', description: '', profitMargin: 0 });
    setSelectedRecipes([]);
    setSelectedSupplies([]);    
  };

  const handleRemoveItem = (id, type) => {
    if (type === 'recipe') {
      setSelectedRecipes(selectedRecipes.filter(item => item.id !== id));
    } else if (type === 'supply') {
      setSelectedSupplies(selectedSupplies.filter(item => item.id !== id));
    }
  };

  const filteredItems = (type) => {
    return (type === 'recipe' ? recipes : supplies)
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 10);
  };



  return (
    <div className="plato-container">
      <div className="left-panel">
        <Form layout="vertical" onFinish={handleSubmit} className="plato-form">
          <h2>Crear un producto</h2>
          <Form.Item label="Nombre del producto" required>
            <Input value={plato.name} onChange={e => setPlato({ ...plato, name: e.target.value })} />
          </Form.Item>
          <Form.Item label="Descripción">
            <Input.TextArea value={plato.description} onChange={e => setPlato({ ...plato, description: e.target.value })} rows={4} />
          </Form.Item>
          <Form.Item label="Ganancia (%)">
            <InputNumber value={plato.profitMargin} onChange={value => setPlato({ ...plato, profitMargin: value })} />
          </Form.Item>
          <Button 
  type="primary" 
  htmlType="submit"
  disabled={
    !plato.name.trim() ||
    (selectedRecipes.length === 0 && selectedSupplies.length === 0)
  }
>
  Guardar
</Button>
        </Form>       
      </div>

      <div className="right-panel">
        <div className="actions">
          <Button type="primary" onClick={() => openSelectModal('recipe')}>Agregar producto</Button>
          <Button type="primary" onClick={() => openSelectModal('supply')} style={{ marginLeft: '10px' }}>Otros Insumos</Button>
        </div>
        
        <div className="tables-container">
          <h3>Productos seleccionados</h3>
          <Table columns={[{ title: 'Nombre', dataIndex: 'name', key: 'name' }, 
            { title: 'Cantidad', dataIndex: 'selectedQuantity', key: 'selectedQuantity' },
            { title: 'Acción', render: (_, record) => <Button danger onClick={() => handleRemoveItem(record.id, 'recipe')}>Quitar</Button> }
              ]} 
              dataSource={selectedRecipes} 
              rowKey="id" 
              pagination={false} 
              />
          
          <h3>Otros insumos seleccionados</h3>
          <Table columns={[
            { title: 'Nombre', dataIndex: 'name', key: 'name' },
            { title: 'Cantidad', dataIndex: 'selectedQuantity', key: 'selectedQuantity' },
            {title: 'Acción', render: (_, record) => <Button danger onClick={() => handleRemoveItem(record.id, 'supply')}>Quitar</Button> }
                      
          ]}
              dataSource={selectedSupplies} 
              rowKey="id"
              pagination={false} 
              />
        </div>
      </div>

      <Modal title="Seleccionar Item" visible={isSelectModalVisible} onCancel={() => setIsSelectModalVisible(false)} footer={null}>
  <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  <Table 
    columns={[
      { title: 'Nombre', dataIndex: 'name', key: 'name' },
      { title: 'Acción', render: (_, record) => (
        <Button onClick={() => handleSelectItem(record)}>Seleccionar</Button>
      )}
    ]} 
    dataSource={filteredItems(selectType)} 
    rowKey="id" 
    pagination={false} 
    scroll={{ y: 300 }} 
  />
</Modal>

      <Modal title="Ingresar Cantidad" visible={isQuantityModalVisible} onOk={handleAddSelectedItem} onCancel={() => setIsQuantityModalVisible(false)}>
        <Form.Item label="Cantidad">
          <InputNumber value={quantity} onChange={setQuantity} min={1} />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default Plato;

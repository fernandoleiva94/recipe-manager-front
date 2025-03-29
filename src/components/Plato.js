import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Modal, InputNumber, message, Form } from 'antd';
import axiosInstance from '../Axios';
import './FormularioPlato.css';

const Plato = () => {
  const [recipes, setRecipes] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [selectedSupplies, setSelectedSupplies] = useState([]);
  const [selectedPackagingSupplies, setSelectedPackagingSupplies] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [plato, setPlato] = useState({ name: '', description: '', profitMargin: 0 });
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [selectType, setSelectType] = useState('');

  useEffect(() => {
    fetchRecipes();
    fetchSupplies();
  }, []);

  const fetchRecipes = () => {
    axiosInstance.get('/api/recipes')
      .then(response => setRecipes(response.data))
      .catch(() => message.error('Error al obtener recetas'));
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
      } else if (selectType === 'packaging') {
        setSelectedPackagingSupplies([...selectedPackagingSupplies, updatedItem]);
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
      packagingSupplies: selectedPackagingSupplies.map(packaging => ({ id: packaging.id, quantity: packaging.selectedQuantity })),
      profitMargin: plato.profitMargin,
    };

    axiosInstance.post('/api/dishes', payload)
      .then(() => {
        message.success('Plato creado correctamente');
        resetForm();
      })
      .catch(() => message.error('Error al crear el plato'));
  };

  const resetForm = () => {
    setPlato({ name: '', description: '', profitMargin: 0 });
    setSelectedRecipes([]);
    setSelectedSupplies([]);
    setSelectedPackagingSupplies([]);
  };

  return (
    <div className="plato-container">
      <div className="left-panel">
        <Form layout="vertical" onFinish={handleSubmit} className="plato-form">
          <h2>Crear un Plato</h2>
          <Form.Item label="Nombre del plato" required>
            <Input value={plato.name} onChange={e => setPlato({ ...plato, name: e.target.value })} />
          </Form.Item>
          <Form.Item label="Descripción">
            <Input.TextArea value={plato.description} onChange={e => setPlato({ ...plato, description: e.target.value })} rows={4} />
          </Form.Item>
          <Form.Item label="Ganancia (%)">
            <InputNumber value={plato.profitMargin} onChange={value => setPlato({ ...plato, profitMargin: value })} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Guardar Plato</Button>
        </Form>

        <div className="packaging-table">
          <h3>Insumos de Packaging</h3>
          <Table 
            columns={[{ title: 'Nombre', dataIndex: 'name', key: 'name' }, { title: 'Cantidad', dataIndex: 'selectedQuantity', key: 'selectedQuantity' }]} 
            dataSource={selectedPackagingSupplies} 
            rowKey="id" 
            pagination={false} 
          />
        </div>
      </div>

      <div className="right-panel">
        <div className="actions">
          <Button type="primary" onClick={() => openSelectModal('recipe')}>Agregar Receta</Button>
          <Button type="primary" onClick={() => openSelectModal('supply')} style={{ marginLeft: '10px' }}>Agregar Insumo</Button>
          <Button type="primary" onClick={() => openSelectModal('packaging')} style={{ marginLeft: '10px' }}>Agregar Insumo de Packaging</Button>
        </div>
        
        <div className="tables-container">
          <h3>Recetas seleccionadas</h3>
          <Table columns={[{ title: 'Nombre', dataIndex: 'name', key: 'name' }, { title: 'Cantidad', dataIndex: 'selectedQuantity', key: 'selectedQuantity' }]} dataSource={selectedRecipes} rowKey="id" pagination={false} />
          
          <h3>Insumos seleccionados</h3>
          <Table columns={[{ title: 'Nombre', dataIndex: 'name', key: 'name' }, { title: 'Cantidad', dataIndex: 'selectedQuantity', key: 'selectedQuantity' }]} dataSource={selectedSupplies} rowKey="id" pagination={false} />
        </div>
      </div>

      <Modal title={selectType === 'recipe' ? 'Seleccionar Receta' : selectType === 'packaging' ? 'Seleccionar Insumo de Packaging' : 'Seleccionar Insumo'} visible={isSelectModalVisible} onCancel={() => setIsSelectModalVisible(false)} footer={null}>
        <Table 
          columns={[{ title: 'Nombre', dataIndex: 'name', key: 'name' }, { title: 'Acción', render: (_, record) => <Button onClick={() => handleSelectItem(record)}>Seleccionar</Button> }]} 
          dataSource={selectType === 'recipe' ? recipes : selectType === 'packaging' ? supplies.filter(s => s.category === 'packaging') : supplies} 
          rowKey="id" 
          pagination={false} 
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

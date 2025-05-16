import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Drawer, Descriptions } from 'antd';
import axiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const RecetasList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Receta seleccionada
  const [drawerVisible, setDrawerVisible] = useState(false); // Estado del panel lateral
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    setLoading(true);
    axiosInstance
      .get('/api/recipes')
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        message.error('Error fetching recipes');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/api/recipes/${id}`)
      .then(() => {
        message.success('Recipe deleted');
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
        setFilteredRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      })
      .catch(() => {
        message.error('Error deleting recipe');
      });
  };

  const handleEdit = (id) => {
    navigate(`/recetas/editar/${id}`);
  };

  const handleSearch = (value) => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const showDrawer = (record) => {
    setSelectedRecipe(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedRecipe(null);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '-',
    },
    {
      title: 'Cost',
      dataIndex: 'costRecipe',
      key: 'costRecipe',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button
            type="default"
            onClick={() => showDrawer(record)}
            style={{ marginRight: 10 }}
          >
            View
          </Button>
          <Button
            type="primary"
            onClick={() => handleEdit(record.id)}
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this recipe?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const supplyColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  return (
    <div className="recetas-list-container">
      <h2>Recipe List</h2>
      <Search
        placeholder="Search recipes by name"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <Table
        columns={columns}
        dataSource={filteredRecipes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Drawer de detalle */}
      <Drawer
        title="Recipe Detail"
        placement="right"
        width={500}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedRecipe && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name">{selectedRecipe.name}</Descriptions.Item>
              <Descriptions.Item label="Unit">{selectedRecipe.unit}</Descriptions.Item>
              <Descriptions.Item label="Quantity">{selectedRecipe.quantity}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedRecipe.description || '-'}</Descriptions.Item>
              <Descriptions.Item label="Total Cost">{selectedRecipe.costRecipe}</Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: 20 }}>Supplies</h3>
            <Table
              dataSource={selectedRecipe.supplies || []}
              columns={supplyColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </>
        )}
      </Drawer>
    </div>
  );
};

export default RecetasList;

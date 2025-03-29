import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input } from 'antd';
import axiosInstance from '../Axios';
import { useNavigate } from 'react-router-dom';

const { Search } = Input; // Componente de búsqueda de Ant Design

const RecetasList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Estado para las recetas filtradas
  const [loading, setLoading] = useState(false);
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
        setFilteredRecipes(response.data); // Inicialmente, las recetas filtradas son todas
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
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
        setFilteredRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      })
      .catch((error) => {
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

  // Columnas para la tabla
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Portions',
      dataIndex: 'portion',
      key: 'portion',
    },
    {
      title: 'Cost',
      dataIndex: 'costTotal',
      key: 'costTotal',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(record.id)} style={{ marginRight: 10 }}>
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

  return (
    <div className="recetas-list-container">
      <h2>Recipe List</h2>
      <Search
        placeholder="Search recipes by name"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)} // Permitir búsqueda mientras se escribe
        style={{ marginBottom: 20 }}
      />
      <Table
        columns={columns}
        dataSource={filteredRecipes} // Usar las recetas filtradas
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RecetasList;

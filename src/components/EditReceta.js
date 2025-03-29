import React, { useState, useEffect } from 'react';
import { Input, Button, Form, InputNumber, message } from 'antd';
import axiosInstance from '../Axios'; // Asegúrate de que la ruta sea correcta
import { useParams } from 'react-router-dom'; // Para obtener el ID de la receta de la URL

const EditReceta = () => {
  const { id } = useParams(); // Obtener el ID de la receta desde la URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = () => {
    axiosInstance.get(`/api/recipes/${id}`)
      .then(response => {
        setRecipe(response.data); // Carga la receta para su edición
      })
      .catch(error => {
        message.error('Error fetching recipe');
      });
  };

  const handleSubmit = (values) => {
    axiosInstance.put(`/api/recipes/${id}`, values)
      .then(() => {
        message.success('Recipe updated successfully');
      })
      .catch(error => {
        message.error('Error updating recipe');
      });
  };

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-receta-container">
      <h2>Edit Recipe</h2>
      <Form layout="vertical" onFinish={handleSubmit} initialValues={recipe}>
        <Form.Item label="Recipe Name" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item label="Final Cooked Weight (grams)" name="weightFinal">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Number of Portions" name="portion">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Total Cost" name="costTotal">
          <InputNumber />
        </Form.Item>
        <Button type="primary" htmlType="submit">Save Changes</Button>
      </Form>
    </div>
  );
};

export default EditReceta;

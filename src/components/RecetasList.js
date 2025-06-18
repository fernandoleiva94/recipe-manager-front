import React, { useEffect, useState } from "react";
import { Table, Button, message, Input } from "antd";
import axiosInstance from "../util/RecipeAxios";
import EditRecipe from "./EditRecipe";

const RecetasList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = async () => {
    try {
      const response = await axiosInstance.get("/api/recipes");
      setRecipes(response.data);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
      message.error("Error fetching recipes");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/recipes/${id}`);
      message.success("Receta eliminada correctamente");
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe", error);
      message.error("Error al eliminar la receta");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Cantidad", dataIndex: "quantity", key: "quantity" },
    { title: "Unidad", dataIndex: "unit", key: "unit" },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setEditRecipeId(record.id);
              setEditDrawerVisible(true);
            }}
            style={{ marginRight: 10 }}
          >
            Editar
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Input
        placeholder="Buscar recetas..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table columns={columns} dataSource={filteredRecipes} rowKey="id" />

      <EditRecipe
        recipeId={editRecipeId}
        visible={editDrawerVisible}
        onClose={() => {
          setEditDrawerVisible(false);
          fetchRecipes();
        }}
      />
    </>
  );
};

export default RecetasList;

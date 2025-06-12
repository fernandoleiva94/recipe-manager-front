import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Drawer,
  Button,
  Typography,
  Image,
  Popconfirm,
  message,
  Input,
  Row,
  Col,
  Spin,
} from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axiosInstance from "../Axios";

const { Title, Text } = Typography;

const DishesList = () => {
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/api/dishes")
      .then((response) => {
        setDishes(response.data);
        setFilteredDishes(response.data);
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  }, []);

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/api/dishes/${id}`)
      .then(() => {
        message.success("Plato eliminado");
        const updatedDishes = dishes.filter((dish) => dish.id !== id);
        setDishes(updatedDishes);
        setFilteredDishes(updatedDishes);
        setDrawerVisible(false);
      })
      .catch(() => message.error("Error eliminando el plato"));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredDishes(
      dishes.filter((dish) => dish.name.toLowerCase().includes(value))
    );
  };

  const openDrawerWithDish = (id) => {
    setLoadingDetail(true);
    axiosInstance
      .get(`/api/dishes/${id}`)
      .then((response) => {
        setSelectedDish(response.data);
        setDrawerVisible(true);
      })
      .catch(() => message.error("Error cargando detalle del plato"))
      .finally(() => setLoadingDetail(false));
  };

  return (
    <div>
      <Input
        placeholder="Buscar plato..."
        value={searchTerm}
        onChange={handleSearch}
        prefix={<SearchOutlined />}
        style={{ marginBottom: 16, width: "100%" }}
      />
      <Row gutter={[16, 16]}>
        {filteredDishes.map((dish) => (
          <Col xs={24} sm={12} md={8} lg={6} key={dish.id}>
            <Card
              hoverable
              cover={
                dish.image && (
                  <Image
                    alt={dish.name}
                    src={dish.image}
                    style={{ height: 150, objectFit: "cover" }}
                    preview={false}
                  />
                )
              }
              onClick={() => openDrawerWithDish(dish.id)}
            >
              <Title level={4}>{dish.name}</Title>
              <Text strong>Precio: </Text>
              <Text>${dish.price.toFixed(2)}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={selectedDish?.name || "Detalle del Plato"}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
      >
        {loadingDetail ? (
          <Spin />
        ) : selectedDish ? (
          <>
            {selectedDish.image && (
              <Image width={200} src={selectedDish.image} />
            )}
            <Text>{selectedDish.description || "Sin descripción"}</Text>
            <br />
            <br />
            <Text strong>Peso:</Text>{" "}
            <Text>{selectedDish.weight || "No especificado"}</Text>
            <br />
            <br />
            <Text strong>Costo:</Text>{" "}
            <Text>${selectedDish.costDish?.toFixed(2)}</Text>
            <br />
            <br />
            <Text strong>Margen de ganancia:</Text>{" "}
            <Text>{selectedDish.profitMargin}%</Text>
            <br />
            <br />
            <Text strong>Precio:</Text>{" "}
            <Text>${selectedDish.price?.toFixed(2)}</Text>
            <br />
            <br />
            <Title level={5}>Insumos</Title>
            <List
  dataSource={Array.isArray(selectedDish.supplies) ? selectedDish.supplies : []}
  renderItem={(supply) => (
    <List.Item>
      {supply.name} - {supply.quantity} {supply.unit}
    </List.Item>
  )}
/>
            <br />
            <Title level={5}>Recetas</Title>
            <List
  dataSource={selectedDish.recipe || []}
  renderItem={(recipe) => (
    <List.Item>
      {recipe.name} - {recipe.quantity} {recipe.unit} - $
      {recipe.costTotal.toFixed(2)}
    </List.Item>
  )}
/>
            <br />
            <Popconfirm
              title="¿Seguro que deseas eliminar este plato?"
              onConfirm={() => handleDelete(selectedDish.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Eliminar
              </Button>
            </Popconfirm>
          </>
        ) : (
          <Text>No se pudo cargar la información del plato</Text>
        )}
      </Drawer>
    </div>
  );
};

export default DishesList;

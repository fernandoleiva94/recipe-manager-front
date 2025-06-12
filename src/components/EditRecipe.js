import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select,
  Space,
  message,
  InputNumber,
  Divider,
  List
} from "antd";
import axiosInstance from "../Axios";

const EditRecipe = ({ recipeId, visible, onClose }) => {
  const [form] = Form.useForm();
  const [availableSupplies, setAvailableSupplies] = useState([]);
  const [currentSupplies, setCurrentSupplies] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔸 Las unidades fijas
  const units = ["gramos", "unidad", "mililitros"];

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
      fetchAvailableSupplies();
    } else {
      form.resetFields();
      setCurrentSupplies([]);
    }
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const response = await axiosInstance.get(`/api/recipes/${recipeId}`);
      const data = response.data;
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit
      });
      // Adaptar los supplies actuales
      const mappedSupplies = data.supplies.map((s) => ({
        id: s.id,
        name: s.name,
        quantity: s.quantity,
        unit: s.unit
      }));
      setCurrentSupplies(mappedSupplies);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      message.error("Error fetching recipe");
    }
  };

  const fetchAvailableSupplies = async () => {
    try {
      const response = await axiosInstance.get("/api/supplies");
      setAvailableSupplies(response.data);
    } catch (error) {
      console.error("Error fetching supplies:", error);
      message.error("Error fetching supplies");
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const updatedRecipe = {
        name: values.name,
        description: values.description,
        unit: values.unit,
        quantity: values.quantity,
        ingredients: currentSupplies.map((s) => ({
          supplyId: s.id,
          quantity: s.quantity,
          costKg: 0 // Ajustar según tu lógica
        }))
      };
      await axiosInstance.put(`/api/recipes/${recipeId}`, updatedRecipe);
      message.success("Receta actualizada exitosamente");
      onClose();
    } catch (error) {
      console.error("Error updating recipe:", error);
      message.error("Error actualizando receta");
    } finally {
      setLoading(false);
    }
  };

  const addSupply = (supplyId) => {
    const selected = availableSupplies.find((s) => s.id === supplyId);
    if (!selected) return;

    const alreadyAdded = currentSupplies.find((s) => s.id === supplyId);
    if (alreadyAdded) {
      message.warning("Este insumo ya está agregado");
      return;
    }

    setCurrentSupplies([
      ...currentSupplies,
      { id: selected.id, name: selected.name, quantity: 0, unit: selected.unit }
    ]);
  };

  const removeSupply = (supplyId) => {
    setCurrentSupplies(currentSupplies.filter((s) => s.id !== supplyId));
  };

  const updateSupplyQuantity = (supplyId, newQuantity) => {
    setCurrentSupplies((prev) =>
      prev.map((s) =>
        s.id === supplyId ? { ...s, quantity: newQuantity } : s
      )
    );
  };

  return (
    <Drawer
      title="Editar Receta"
      width={500}
      onClose={onClose}
      open={visible}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
        >
          <Input.TextArea maxLength={500} rows={4} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Cantidad"
          rules={[{ required: true, message: "Por favor ingresa la cantidad" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Unidad"
          rules={[{ required: true, message: "Por favor selecciona la unidad" }]}
        >
          <Select placeholder="Selecciona una unidad">
            {units.map((unit) => (
              <Select.Option key={unit} value={unit}>
                {unit}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        <h4>Insumos</h4>

        <Select
          showSearch
          placeholder="Seleccionar insumo"
          optionFilterProp="label"
          onSelect={(value) => addSupply(value)}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          options={availableSupplies.map((s) => ({
            label: `${s.name} (${s.unit})`,
            value: s.id
          }))}
          style={{ width: "100%", marginBottom: 16 }}
        />

        <List
          bordered
          dataSource={currentSupplies}
          renderItem={(supply) => (
            <List.Item
              actions={[
                <Button
                  danger
                  size="small"
                  onClick={() => removeSupply(supply.id)}
                >
                  Quitar
                </Button>
              ]}
            >
              <Space>
                <strong>{supply.name}</strong> ({supply.unit})
                <InputNumber
                  min={0}
                  value={supply.quantity}
                  onChange={(value) =>
                    updateSupplyQuantity(supply.id, value)
                  }
                />
              </Space>
            </List.Item>
          )}
        />
        <Divider />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Actualizar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditRecipe;

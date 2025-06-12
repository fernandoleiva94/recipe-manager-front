import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Typography,
  Spin,
  message,
  Button,
  Form,
  Input,
  Select,
} from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      message.error("No se encontró el token.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const fetchData = async () => {
      try {
        const personResponse = await axios.get(
          `http://localhost:8081/api/people/${userId}`
        );
        setUserData(personResponse.data);
        form.setFieldsValue(personResponse.data);

        const subscriptionResponse = await axios.get(
          "http://localhost:8083/api/subscriptions/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const activePlan = subscriptionResponse.data.find((sub) => sub.active);
        setSubscription(activePlan);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        message.error("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, form]);

  const handleUpdate = async (values) => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      await axios.put(
        `http://localhost:8081/api/people/${userId}`,
        {
          ...userData,
          ...values,
          email: userData.email, // Email no editable
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Datos actualizados correctamente.");
      setUserData({ ...userData, ...values });
      setEditMode(false);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      message.error("No se pudieron actualizar los datos.");
    }
  };

  // ✅ Agregado chequeo para evitar acceder a propiedades de null
  if (loading || !userData) {
    return <Spin tip="Cargando datos..." />;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Perfil del Usuario</Title>

      <Card
        title="Datos Personales"
        style={{ marginBottom: 24 }}
        extra={
          !editMode && (
            <Button type="primary" onClick={() => setEditMode(true)}>
              Editar
            </Button>
          )
        }
      >
        {editMode ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={userData}
          >
            <Form.Item name="firstName" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Apellido" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
            <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Dirección" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="documentType" label="Tipo de Documento" rules={[{ required: true }]}>
              <Select>
                <Option value="DU">DU</Option>
                <Option value="CUIT">CUIT</Option>
                <Option value="CUIL">CUIL</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="documentNumber"
              label="Número de Documento"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="taxCondition" label="Condición Fiscal" rules={[{ required: true }]}>
              <Select>
                <Option value="RI">RI</Option>
                <Option value="CF">CF</Option>
                <Option value="EX">EX</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                Guardar Cambios
              </Button>
              <Button onClick={() => setEditMode(false)}>Cancelar</Button>
            </Form.Item>
          </Form>
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Nombre">
              {userData.firstName} {userData.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
            <Descriptions.Item label="Teléfono">{userData.phone}</Descriptions.Item>
            <Descriptions.Item label="Dirección">{userData.address}</Descriptions.Item>
            <Descriptions.Item label="Documento">
              {userData.documentType} - {userData.documentNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Condición Fiscal">
              {userData.taxCondition}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Plan Activo">
        {subscription ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Sistema">{subscription.systemName}</Descriptions.Item>
            <Descriptions.Item label="Plan">{subscription.planName}</Descriptions.Item>
            <Descriptions.Item label="Inicio">{subscription.startDate}</Descriptions.Item>
            <Descriptions.Item label="Vencimiento">{subscription.endDate}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              {subscription.active ? "Activo" : "Inactivo"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No hay un plan activo</p>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;

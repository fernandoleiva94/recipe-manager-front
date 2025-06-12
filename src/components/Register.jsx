// Register.js
import React, { useState } from "react";
import { Form, Input, Button, Select, Typography, message, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import rightImage from "../img/8d5dd459-c2d0-471e-9b98-fd73592e4525.png";
import "../Login.css";

const { Option } = Select;
const { Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const onFinish = async (values) => {
    if (values.email !== values.confirmEmail) {
      message.error("Los correos electrónicos no coinciden");
      return;
    }
    if (values.password !== values.confirmPassword) {
      message.error("Las contraseñas no coinciden");
      return;
    }

    const data = {
      person: {
        firstName: values.firstName,
        lastName: values.lastName,
        documentType: values.documentType,
        documentNumber: values.documentNumber,
        email: values.email,
      },
      user: {
        username: values.username,
        password: values.password,
        role: {
          id: 1,
        },
      },
    };

    try {
      await axios.post("http://localhost:8081/api/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // para manejar la cookie de sesión
      });

      message.success("Usuario registrado exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error en registro:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.errors) {
          data.errors.forEach((err) => {
            message.error(err.defaultMessage || "Error en el formulario");
          });
        } else if (status === 409 && data.message) {
          message.error(data.message);
        } else if (status === 500 && data.message) {
          message.error("Error interno del servidor");
        } else {
          message.error("Error desconocido");
        }
      } else {
        message.error("Error de conexión con el servidor");
      }
    }
  };

  const onFieldsChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    const allTouched = form.isFieldsTouched(
      [
        "firstName",
        "lastName",
        "documentType",
        "documentNumber",
        "email",
        "confirmEmail",
        "username",
        "password",
        "confirmPassword",
      ],
      true
    );
    setIsButtonDisabled(!(allTouched && !hasErrors));
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-form-container">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Registro de usuario</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFieldsChange={onFieldsChange}
          >
            <Form.Item
              label="Nombre"
              name="firstName"
              rules={[{ required: true, message: "Ingrese su nombre!" }]}
            >
              <Input placeholder="Nombre" />
            </Form.Item>

            <Form.Item
              label="Apellido"
              name="lastName"
              rules={[{ required: true, message: "Ingrese su apellido!" }]}
            >
              <Input placeholder="Apellido" />
            </Form.Item>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="Tipo de documento"
                  name="documentType"
                  rules={[{ required: true, message: "Seleccione el tipo de documento!" }]}
                >
                  <Select placeholder="Seleccione">
                    <Option value="DU">DU</Option>
                    <Option value="CUIT">CUIT</Option>
                    <Option value="CUIL">CUIL</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Número de documento"
                  name="documentNumber"
                  rules={[
                    { required: true, message: "Ingrese su número de documento!" },
                    { pattern: /^\d+$/, message: "Solo números!" },
                  ]}
                >
                  <Input placeholder="Número de documento" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: "Ingrese su correo!" },
                { type: "email", message: "Ingrese un correo válido!" },
              ]}
            >
              <Input placeholder="Correo electrónico" />
            </Form.Item>

            <Form.Item
              label="Repetir correo electrónico"
              name="confirmEmail"
              rules={[
                { required: true, message: "Repita su correo!" },
                { type: "email", message: "Ingrese un correo válido!" },
              ]}
            >
              <Input placeholder="Repetir correo electrónico" />
            </Form.Item>

            <Form.Item
              label="Nombre de usuario"
              name="username"
              rules={[{ required: true, message: "Ingrese su usuario!" }]}
            >
              <Input placeholder="Usuario" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Ingrese su contraseña!" }]}
            >
              <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Form.Item
              label="Repetir contraseña"
              name="confirmPassword"
              rules={[{ required: true, message: "Repita su contraseña!" }]}
            >
              <Input.Password placeholder="Repetir contraseña" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="login-button"
                disabled={isButtonDisabled}
              >
                Registrarme
              </Button>
            </Form.Item>
          </Form>
          <div className="register-link">
            <Text>¿Ya tienes una cuenta? </Text>
            <Button type="link" onClick={() => navigate("/login")}>
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
      <div className="login-right">
        <img src={rightImage} alt="Imagen lateral" className="login-image" />
      </div>
    </div>
  );
};

export default Register;

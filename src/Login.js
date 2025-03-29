import React from "react";
import { Form, Input, Button, Card } from "antd";
import "./Login.css";
import logo from "../src/img/logo.png"; // Asegúrate de reemplazar con la ruta correcta de tu logo

const Login = () => {
  const onFinish = (values) => {
    console.log("Login Info:", values);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Por favor ingrese su usuario!" }]}
          >
            <Input placeholder="Ingrese su usuario" />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Por favor ingrese su contraseña!" }]}
          >
            <Input.Password placeholder="Ingrese su contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
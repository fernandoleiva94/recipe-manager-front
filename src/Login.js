import React, { useContext } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { AuthContext } from "./AuthContext"; // <- Asegurate que la ruta esté bien
import "./Login.css";
import logo from "./img/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // <- Obtenemos la función login del contexto

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:8082/v1/auth/login", values);
      login(response.data.token); // <- Usamos el contexto, no localStorage directamente
      message.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
      message.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Usuario" name="username" rules={[{ required: true, message: "Ingrese su usuario!" }]}>
            <Input placeholder="Usuario" />
          </Form.Item>
          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Ingrese su contraseña!" }]}>
            <Input.Password placeholder="Contraseña" />
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

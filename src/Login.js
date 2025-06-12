import React, { useContext } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import "./Login.css";
import logo from "./img/logo.png";
import rightImage from "./img/8d5dd459-c2d0-471e-9b98-fd73592e4525.png"; // la imagen de la derecha

const { Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:8082/v1/auth/login", values);
      login(response.data.token);
      message.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
      message.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-form-container">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Iniciar sesión</h2>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Correo electrónico"
              name="username"
              rules={[{ required: true, message: "Ingrese su correo electrónico!" }]}
            >
              <Input placeholder="Correo electrónico" />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Ingrese su contraseña!" }]}
            >
              <Input.Password placeholder="Contraseña" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="login-button">
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
          <div className="register-link">
            <Text>¿No tienes una cuenta? </Text>
            <Link to="/register">Registrarte</Link>
          </div>
        </div>
      </div>
      <div className="login-right">
        <img src={rightImage} alt="Imagen lateral" className="login-image" />
      </div>
    </div>
  );
};

export default Login;

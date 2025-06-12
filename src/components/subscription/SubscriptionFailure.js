import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const SubscriptionFailure = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="Hubo un error con el pago"
      subTitle="No se pudo procesar el pago. Por favor, intentá nuevamente o contactanos."
      extra={[
        <Button type="primary" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>,
      ]}
    />
  );
};

export default SubscriptionFailure;

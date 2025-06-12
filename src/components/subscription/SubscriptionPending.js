import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const SubscriptionPending = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="warning"
      title="Pago pendiente"
      subTitle="Tu pago está siendo procesado. Te avisaremos cuando se acredite."
      extra={[
        <Button type="primary" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>,
      ]}
    />
  );
};

export default SubscriptionPending;

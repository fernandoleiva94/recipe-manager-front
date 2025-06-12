import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import axios from "axios";


export const createPayment = async (plan, userId) => {
  try {
    const response = await axios.post("http://localhost:8083/api/mp/pay", {
      title: plan.name,
      price: plan.price,
      planId: plan.id,
      userId: userId,
    });
    return response.data.init_point;
  } catch (error) {
    throw new Error("Error al crear preferencia de pago.");
  }
};

const AvailablePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8083/api/plans/system/1", {
    
      });
      setPlans(response.data);
    } catch (error) {
      message.error("Error al cargar los planes disponibles.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Planes Disponibles</h2>
      {loading ? (
        <Spin />
      ) : (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {plans.map((plan) => (
            <Card key={plan.id} title={plan.name} style={{ width: 300 }}>
              <p><strong>Descripción:</strong> {plan.description}</p>
              <p><strong>Precio:</strong> ${plan.price}</p>
              <p><strong>Duración:</strong> {plan.durationInDays} días</p>
              <Button
  type="primary"
  onClick={async () => {
    try {
      const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;
      const initPoint = await createPayment(plan, userId);
      localStorage.setItem("selectedPlanId", plan.id); // 👈 Guardamos el plan
      window.location.href = initPoint; // redirige a Mercado Pago
    } catch (error) {
      message.error("Error al iniciar el pago.");
    }
  }}
>
  Suscribirme
</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailablePlans;

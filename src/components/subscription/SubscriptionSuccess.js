import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');    
    const planId = localStorage.getItem('selectedPlanId'); // guardaste esto antes de redirigir

    if (paymentId && planId) {
      const activateSubscription = async () => {
        try {
          const response = await axios.post(
            'http://localhost:8083/api/subscriptions',
            { planId: parseInt(planId) },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
               // si usás cookies de sesión
            }
          );

          console.log('✅ Suscripción activada:', response.data);
          alert('Tu suscripción fue activada correctamente.');
          navigate('/dashboard'); // redirigí a donde quieras
        } catch (error) {
          console.error('❌ Error al activar suscripción:', error);
          alert('Hubo un error activando la suscripción. Contactanos.');
        }
      };

      activateSubscription();
    } else {
      alert('Parámetros inválidos. No se puede activar la suscripción.');
      navigate('/dashboard');
    }
  }, [searchParams, token, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Procesando tu suscripción...</h2>
    </div>
  );
};

export default SubscriptionSuccess;

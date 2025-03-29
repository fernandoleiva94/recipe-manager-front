import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        axios.get('/api/pedidos')
            .then(response => setPedidos(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Pedidos</h2>
            <ul>
                {pedidos.map(pedido => (
                    <li key={pedido.id}>{pedido.producto} - {pedido.cantidad}</li>
                ))}
            </ul>
        </div>
    );
};

export default Pedidos;

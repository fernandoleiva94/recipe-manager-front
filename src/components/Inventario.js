import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
    const [inventario, setInventario] = useState([]);

    useEffect(() => {
        axios.get('/api/inventario')
            .then(response => setInventario(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Inventario</h2>
            <ul>
                {inventario.map(item => (
                    <li key={item.id}>{item.producto}: {item.cantidad}</li>
                ))}
            </ul>
        </div>
    );
};

export default Inventario;

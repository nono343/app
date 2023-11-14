import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProductionMonth = () => {
    const [productos, setProductos] = useState([]);
    const [productoId, setProductoId] = useState('');
    const [selectedMonths, setSelectedMonths] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/productos')
            .then(response => setProductos(response.data.products))
            .catch(error => console.error('Error al obtener la lista de productos:', error));
    }, []);

    const handleAgregarMeses = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/productos/${productoId}/meses/agregar`, { meses: selectedMonths });

            console.log('Respuesta del servidor:', response.data);
            console.log('Meses de producción agregados con éxito', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Error al agregar meses de producción:', error.response.data.error || error.response.data.message);
            } else if (error.request) {
                console.error('Error de red: No se recibió respuesta del servidor');
            } else {
                console.error('Error inesperado:', error.message);
            }
        }
    };

    const handleCheckboxChange = (month) => {
        const updatedMonths = selectedMonths.includes(month)
            ? selectedMonths.filter(selectedMonth => selectedMonth !== month)
            : [...selectedMonths, month];

        setSelectedMonths(updatedMonths);
    };

    return (
        <div>
            <h2>Agregar Meses de Producción</h2>
            <label>
                Producto:
                <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
                    <option value="">Selecciona un producto</option>
                    {productos && productos.map && productos.map(product => (
                        <option key={product.id} value={product.id}>{product.nombreesp}</option>
                    ))}
                </select>
            </label>
            <br />
            <label>Meses de producción:</label>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                <div key={month}>
                    <input
                        type="checkbox"
                        id={`month-${month}`}
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleCheckboxChange(month)}
                    />
                    <label htmlFor={`month-${month}`}>{`Mes ${month}`}</label>
                </div>



            ))}
            <br />
            <button onClick={handleAgregarMeses} disabled={!productoId || selectedMonths.length === 0}>
                Agregar Meses
            </button>
        </div>
    );
};


export default AdminProductionMonth;

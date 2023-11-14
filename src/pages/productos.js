import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';

const DetalleProducto = () => {
    const { store, actions } = useContext(Context);
    const { categoriaId, productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const { isLoggedIn, user } = store;
    const { id, username, is_admin } = user;

    useEffect(() => {
        const fetchDetalleProducto = async () => {
            try {
                const response = await axios.get(`/categories/${categoriaId}/productos/${productoId}`);
                const data = response.data;
                setProducto(data.product);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDetalleProducto();
    }, [categoriaId, productoId]);

    if (!producto) {
        return <p>Cargando...</p>;
    }

    console.log('Datos del producto:', producto);

    return (
        <div>
            <h2>{producto.nombreesp}</h2>
            <p>{producto.descripcionesp}</p>
            <h3>Packagings del Producto</h3>
            <ul>
                {producto.packagings.map((packaging) => (
                    <li key={packaging.id}>
                        <p>{packaging.nombreesp}</p>
                        {/* Otros detalles del packaging */}
                    </li>
                ))}
            </ul>
            <h3>Meses de Producción del Producto</h3>
            <ul>
                {producto.meses_produccion.map((mes, index) => (
                    <li key={index}>
                        <p>{mes}</p>
                        {/* Otros detalles del mes de producción */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetalleProducto;

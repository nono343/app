import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Aaa = () => {
    const [file, setFile] = useState(null);
    const [nombreesp, setNombreEsp] = useState('');
    const [nombreeng, setNombreEng] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [calibre, setCalibre] = useState('');
    const [pesoPresentacion, setPesoPresentacion] = useState('');
    const [pesoNeto, setPesoNeto] = useState('');
    const [tamanoCaja, setTamanoCaja] = useState('');
    const [pallet80x120, setPallet80x120] = useState('');
    const [pesoNetoPallet80x120, setPesoNetoPallet80x120] = useState('');
    const [pallet100x120, setPallet100x120] = useState('');
    const [pesoNetoPallet100x120, setPesoNetoPallet100x120] = useState('');
    const [productoId, setProductoId] = useState('');
    const [userIds, setUserIds] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:5000/users');
                setAvailableUsers(usersResponse.data.users || []);

                const productsResponse = await axios.get('http://localhost:5000/productos'); // Cambiado de 'products' a 'productos'
                setAvailableProducts(productsResponse.data.products || []);
            } catch (error) {
                console.error('Error al obtener la lista de usuarios o productos:', error.response.data.error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('Usuarios actualizados:', availableUsers);
    }, [availableUsers]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCheckboxChange = (id, type) => {
        const stringId = String(id); // Convertir el ID a cadena
    
        if (type === 'user') {
            setUserIds((prevUserIds) =>
                prevUserIds.includes(stringId)
                    ? prevUserIds.filter((userId) => userId !== stringId)
                    : [...prevUserIds, stringId]
            );
        } else if (type === 'product') {
            // Actualizar el estado de productoId
            setProductoId((prevProductId) =>
                prevProductId === stringId ? '' : stringId
            );
    
            // Actualizar el estado de productIds si es necesario
            setProductIds((prevProductIds) =>
                prevProductIds.includes(stringId)
                    ? prevProductIds.filter((productId) => productId !== stringId)
                    : [...prevProductIds, stringId]
            );
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('nombreesp', nombreesp);
            formData.append('nombreeng', nombreeng);
            formData.append('presentacion', presentacion);
            formData.append('calibre', calibre);
            formData.append('peso_presentacion_g', pesoPresentacion);
            formData.append('peso_neto_kg', pesoNeto);
            formData.append('tamano_caja', tamanoCaja);
            formData.append('pallet_80x120', pallet80x120);
            formData.append('peso_neto_pallet_80x120_kg', pesoNetoPallet80x120);
            formData.append('pallet_100x120', pallet100x120);
            formData.append('peso_neto_pallet_100x120_kg', pesoNetoPallet100x120);
            formData.append('producto_id', productoId);

            // Agrega cada user_id al formData
            userIds.forEach((userId) => {
                formData.append('user_ids', userId);
            });

            console.log('Datos del formulario:', formData);

            const response = await axios.post('http://localhost:5000/upload_packaging', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data.message);
            // Realizar acciones adicionales después de la carga exitosa
        } catch (error) {
            console.error('Error en la carga del embalaje:', error.response.data.error);
            // Manejar el error según sea necesario
        }
    };


    const [packagings, setPackagings] = useState([]);

    useEffect(() => {
        const fetchPackagings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/packagings'); // Reemplaza con la ruta correcta
                setPackagings(response.data.packagings || []);
            } catch (error) {
                console.error('Error al obtener los packagings:', error.response.data.error);
            }
        };

        fetchPackagings();
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Archivo:
                    <input type="file" onChange={handleFileChange} />
                </label>
                <label>
                    Nombre en Español:
                    <input type="text" value={nombreesp} onChange={(e) => setNombreEsp(e.target.value)} />
                </label>
                <label>
                    Nombre en Inglés:
                    <input type="text" value={nombreeng} onChange={(e) => setNombreEng(e.target.value)} />
                </label>
                <label>
                    Presentación:
                    <input type="text" value={presentacion} onChange={(e) => setPresentacion(e.target.value)} />
                </label>
                <label>
                    Calibre:
                    <input type="text" value={calibre} onChange={(e) => setCalibre(e.target.value)} />
                </label>
                <label>
                    Peso de Presentación (g):
                    <input type="text" value={pesoPresentacion} onChange={(e) => setPesoPresentacion(e.target.value)} />
                </label>
                <label>
                    Peso Neto (kg):
                    <input type="text" value={pesoNeto} onChange={(e) => setPesoNeto(e.target.value)} />
                </label>
                <label>
                    Tamaño de la Caja:
                    <input type="text" value={tamanoCaja} onChange={(e) => setTamanoCaja(e.target.value)} />
                </label>
                <label>
                    Pallet 80x120:
                    <input type="text" value={pallet80x120} onChange={(e) => setPallet80x120(e.target.value)} />
                </label>
                <label>
                    Peso Neto Pallet 80x120 (kg):
                    <input type="text" value={pesoNetoPallet80x120} onChange={(e) => setPesoNetoPallet80x120(e.target.value)} />
                </label>
                <label>
                    Pallet 100x120:
                    <input type="text" value={pallet100x120} onChange={(e) => setPallet100x120(e.target.value)} />
                </label>
                <label>
                    Peso Neto Pallet 100x120 (kg):
                    <input type="text" value={pesoNetoPallet100x120} onChange={(e) => setPesoNetoPallet100x120(e.target.value)} />
                </label>
                {availableUsers.length > 0 && (
                    <div>
                        <p>Usuarios disponibles:</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {availableUsers.map((user) => (
                                <li key={user.id} style={{ display: 'inline-block', marginRight: '10px' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={user.id}
                                            onChange={() => handleCheckboxChange(user.id, 'user')}
                                            checked={userIds.includes(String(user.id))} // Convertir a cadena para la comparación
                                        />
                                        {user.username}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {availableProducts.length > 0 && (
                    <div>
                        <p>Productos disponibles:</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {availableProducts.map((product) => (
                                <li key={product.id} style={{ display: 'inline-block', marginRight: '10px' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={product.id}
                                            onChange={() => handleCheckboxChange(product.id, 'product')}
                                            checked={productIds.includes(String(product.id))} // Convertir a cadena para la comparación
                                        />
                                        {product.nombreesp}
                                    </label>

                                    {/* Mostrar packagings asociados a cada producto */}
                                    {product.packagings.length > 0 && (
                                        <ul>
                                            {product.packagings.map((packaging) => (
                                                <li key={packaging.id}>
                                                    {packaging.nombreesp} ({packaging.presentacion})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <button type="submit">Enviar</button>
            </form>

            <div>
                <h2>Packagings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre en Español</th>
                            <th>Nombre en Inglés</th>
                            <th>Presentación</th>
                            <th>Calibre</th>
                            <th>Peso de Presentación (g)</th>
                            <th>Peso Neto (kg)</th>
                            <th>Tamaño de la Caja</th>
                            <th>Pallet 80x120</th>
                            <th>Peso Neto Pallet 80x120 (kg)</th>
                            <th>Pallet 100x120</th>
                            <th>Peso Neto Pallet 100x120 (kg)</th>
                            <th>Foto</th>
                            <th>Producto ID</th>
                            <th>Usuarios Asociados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packagings.map((packaging) => (
                            <tr key={packaging.id}>
                                <td>{packaging.id}</td>
                                <td>{packaging.nombreesp}</td>
                                <td>{packaging.nombreeng}</td>
                                <td>{packaging.presentacion}</td>
                                <td>{packaging.calibre}</td>
                                <td>{packaging.peso_presentacion_g}</td>
                                <td>{packaging.peso_neto_kg}</td>
                                <td>{packaging.tamano_caja}</td>
                                <td>{packaging.pallet_80x120}</td>
                                <td>{packaging.peso_neto_pallet_80x120_kg}</td>
                                <td>{packaging.pallet_100x120}</td>
                                <td>{packaging.peso_neto_pallet_100x120_kg}</td>
                                <td>{packaging.foto}</td>
                                <td>{packaging.producto_id}</td>
                                <td>{packaging.users.map((user) => user.username).join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Aaa;

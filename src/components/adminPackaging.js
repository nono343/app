import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPackaging = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [nombreEsp, setNombreEsp] = useState('');
    const [nombreEng, setNombreEng] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [calibre, setCalibre] = useState('');

    const [pesoPresentacionG, setPesoPresentacionG] = useState('');
    const [pesoNetoKg, setPesoNetoKg] = useState('');
    const [tamanoCaja, setTamanoCaja] = useState('');
    const [pallet80x120, setPallet80x120] = useState('');
    const [pesoNetoPallet80x120Kg, setPesoNetoPallet80x120Kg] = useState('');
    const [pallet100x120, setPallet100x120] = useState('');
    const [pesoNetoPallet100x120Kg, setPesoNetoPallet100x120Kg] = useState('');

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);  // Added state for users
    const [categories, setCategories] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');  // State to store the selected product ID
    const [selectedUserId, setSelectedUserId] = useState('');  // State to store the selected user ID
    const [editPackagingId, setEditPackagingId] = useState(null);
    const [editPackagingData, setEditPackagingData] = useState({
        nombreesp: '',
        nombreeng: '',
        presentacion: '',
        calibre: '',
        peso_presentacion_g: '',
        peso_neto_kg: '',
        tamano_caja: '',
        pallet_80x120: '',
        peso_neto_pallet_80x120_kg: '',
        pallet_100x120: '',
        peso_neto_pallet_100x120_kg: '',
        file: null,
    });

    const [showEditModal, setShowEditModal] = useState(false);

    const handleProductChange = (e) => {
        setSelectedProductId(e.target.value);
    };

    const handleUserChange = (e) => {
        setSelectedUserId(e.target.value);
    };



    useEffect(() => {
        axios.get('http://localhost:5000/categories')
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.error('Error fetching categories', error);
            });

        axios.get('http://localhost:5000/productos')
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching products', error);
            });

        axios.get('http://localhost:5000/users')
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((error) => {
                console.error('Error al obtener los usuarios', error);
            });

    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setEditPackagingData({
            ...editPackagingData,
            file: event.target.files[0],
        });
    };

    const handleUpload = async () => {
        if (selectedFile && nombreEsp && nombreEng && selectedProductId && selectedUserId) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('nombreesp', nombreEsp);
            formData.append('nombreeng', nombreEng);
            formData.append('presentacion', presentacion);
            formData.append('calibre', calibre);
            formData.append('peso_presentacion_g', pesoPresentacionG);
            formData.append('peso_neto_kg', pesoNetoKg);
            formData.append('tamano_caja', tamanoCaja);
            formData.append('pallet_80x120', pallet80x120);
            formData.append('peso_neto_pallet_80x120_kg', pesoNetoPallet80x120Kg);
            formData.append('pallet_100x120', pallet100x120);
            formData.append('peso_neto_pallet_100x120_kg', pesoNetoPallet100x120Kg);
            formData.append('producto_id', selectedProductId);  // Added product ID
            formData.append('user_id', selectedUserId);  // Added user ID

            try {
                const response = await axios.post('http://localhost:5000/upload_packaging', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    setUploadedFileName(response.data.message);

                    axios.get('http://localhost:5000/productos')
                        .then((response) => {
                            setProducts(response.data.products);
                        })
                        .catch((error) => {
                            console.error('Error fetching products after upload', error);
                        });
                    } else {
                        console.error('Error en la carga del embalaje con foto:', response.status, response.data);
                    }
                } catch (error) {
                    console.error('Error en la carga del embalaje con foto:', error);
                }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <input type="text" placeholder="Nombre en español" onChange={(e) => setNombreEsp(e.target.value)} />
            <input type="text" placeholder="Nombre en inglés" onChange={(e) => setNombreEng(e.target.value)} />
            <input type="text" placeholder="Presentación" onChange={(e) => setPresentacion(e.target.value)} />
            <input type="text" placeholder="Calibre" onChange={(e) => setCalibre(e.target.value)} />
            <input type="text" placeholder="Peso Presentación (g)" onChange={(e) => setPesoPresentacionG(e.target.value)} />
            <input type="text" placeholder="Peso Neto (kg)" onChange={(e) => setPesoNetoKg(e.target.value)} />
            <input type="text" placeholder="Tamaño Caja" onChange={(e) => setTamanoCaja(e.target.value)} />
            <input type="text" placeholder="Pallet 80x120" onChange={(e) => setPallet80x120(e.target.value)} />
            <input type="text" placeholder="Peso Neto Pallet 80x120 (kg)" onChange={(e) => setPesoNetoPallet80x120Kg(e.target.value)} />
            <input type="text" placeholder="Pallet 100x120" onChange={(e) => setPallet100x120(e.target.value)} />
            <input type="text" placeholder="Peso Neto Pallet 100x120 (kg)" onChange={(e) => setPesoNetoPallet100x120Kg(e.target.value)} />
            <label>
                Producto:
                <select value={selectedProductId} onChange={handleProductChange}>
                    <option value="">Seleccionar producto</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.nombreesp} - {product.nombreeng}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Usuario:
                <select value={selectedUserId} onChange={handleUserChange}>
                    <option value="">Seleccionar usuario</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </label>

            <button onClick={handleUpload}>Subir packaging con foto</button>
            {uploadedFileName && <p>Packaging uploaded: {uploadedFileName}</p>}

            {/* Add your list of products and edit modal as needed */}
        </div>
    );
};

export default AdminPackaging;

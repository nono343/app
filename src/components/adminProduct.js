import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProduct = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [nombreEsp, setNombreEsp] = useState('');
    const [nombreEng, setNombreEng] = useState('');
    const [descripcionEsp, setDescripcionEsp] = useState('');
    const [descripcionEng, setDescripcionEng] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editProductData, setEditProductData] = useState({
        nombreesp: '',
        nombreeng: '',
        descripcionesp: '',
        descripcioneng: '',
        file: null,
    });

    const [showEditModal, setShowEditModal] = useState(false);



    useEffect(() => {
        axios.get('http://localhost:5000/categories')
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });

        axios.get('http://localhost:5000/productos')
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error('Error al obtener los productos', error);
            });
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setEditProductData({
            ...editProductData,
            file: event.target.files[0],
        });
    };


    const handleNombreEspChange = (e) => {
        setNombreEsp(e.target.value);
    };

    const handleNombreEngChange = (e) => {
        setNombreEng(e.target.value);
    };

    const handleDescripcionEspChange = (e) => {
        setDescripcionEsp(e.target.value);
    };

    const handleDescripcionEngChange = (e) => {
        setDescripcionEng(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value);
    };

    const handleUpload = async () => {
        if (selectedFile && nombreEsp && nombreEng && categoryId) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('nombreesp', nombreEsp);
            formData.append('nombreeng', nombreEng);
            formData.append('descripcionesp', descripcionEsp);
            formData.append('descripcioneng', descripcionEng);
            formData.append('categoria', categoryId);

            try {
                const response = await axios.post('http://localhost:5000/upload_product', formData, {
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
                            console.error('Error al obtener los productos después de cargar', error);
                        });
                } else {
                    console.error('Error al cargar el producto con foto');
                }
            } catch (error) {
                console.error('Error al cargar el producto con foto', error);
                console.log(error.response.data); // Agregar esta línea
            }
        }
    };


    const handleDeleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/productos/${productId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data.message); // Mensaje de éxito
            // Actualiza la lista de categorías después de eliminar
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Error en la solicitud:', error.response.data.error); // Mensaje de error
        }
    };



    const handleEditProduct = (productId) => {
        const selectedProduct = products.find(product => product.id === productId);
        setEditProductId(productId);
        setEditProductData({
            nombreesp: selectedProduct.nombreesp,
            nombreeng: selectedProduct.nombreeng,
            descripcionesp: selectedProduct.descripcionesp,
            descripcioneng: selectedProduct.descripcioneng, 
            categoryId: selectedProduct.categoria_id, 
            file: null,
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        const formData = new FormData();
        formData.append('nombreesp', editProductData.nombreesp);
        formData.append('nombreeng', editProductData.nombreeng);
        formData.append('descripcionesp', editProductData.descripcionesp);
        formData.append('descripcioneng', editProductData.descripcioneng);
        formData.append('categoria_id', editProductData.categoryId); 
        formData.append('file', editProductData.file);

        axios.put(`http://localhost:5000/productos/${editProductId}/edit`, formData)
            .then(response => {
                console.log('Edición exitosa:', response.data.message);
                // Actualiza la lista de categorías después de la edición
                axios.get('http://localhost:5000/productos')
                    .then(response => {
                        setCategories(response.data.categories);
                    })
                    .catch(error => {
                        console.error('Error fetching products:', error);
                    });
            })
            .catch(error => {
                console.error('Error en la edición del producto:', error);
            });

        setShowEditModal(false);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <input type="text" placeholder="Nombre en español" onChange={handleNombreEspChange} />
            <input type="text" placeholder="Nombre en inglés" onChange={handleNombreEngChange} />
            <textarea placeholder="Descripción en español" onChange={handleDescripcionEspChange}></textarea>
            <textarea placeholder="Descripción en inglés" onChange={handleDescripcionEngChange}></textarea>
            <label>
                Categoría:
                <select value={categoryId} onChange={handleCategoryChange}>
                    <option value="">Seleccionar categoría</option>
                    {categories && categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.nombreesp} - {category.nombreeng}
                        </option>
                    ))}
                </select>
            </label>
            <button onClick={handleUpload}>Subir producto con foto</button>
            {uploadedFileName && <p>Producto subido: {uploadedFileName}</p>}

            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <strong>{product.nombreesp}</strong> - {product.nombreeng}
                        {product.foto && (
                            <img src={`http://localhost:5000/uploads/${product.foto}`} alt={product.nombreesp} />
                        )}
                        <button onClick={() => handleEditProduct(product.id)}>Editar</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Borrar</button>

                        {/* Mostrar los packagings asociados a este producto */}
                        <ul>
                            {product.packagings && product.packagings.map(packaging => (
                                <li key={packaging.id}>
                                    <strong>{packaging.nombreesp}</strong> - {packaging.nombreeng}
                                    {packaging.foto && (
                                        <img src={`http://localhost:5000/uploads/${packaging.foto}`} alt={packaging.nombreesp} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            {/* Modal de Edición */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
                        <h2>Editar Producto</h2>
                        <label>Nombre en Español:</label>
                        <input
                            type="text"
                            value={editProductData.nombreesp}
                            onChange={(e) => setEditProductData({ ...editProductData, nombreesp: e.target.value })}
                        />
                        <label>Nombre en Inglés:</label>
                        <input
                            type="text"
                            value={editProductData.nombreeng}
                            onChange={(e) => setEditProductData({ ...editProductData, nombreeng: e.target.value })}
                        />
                        <label>Descripción en Español:</label>
                        <textarea
                            value={editProductData.descripcionesp}
                            onChange={(e) => setEditProductData({ ...editProductData, descripcionesp: e.target.value })}
                        ></textarea>
                        <label>Descripción en Inglés:</label>
                        <textarea
                            value={editProductData.descripcioneng}
                            onChange={(e) => setEditProductData({ ...editProductData, descripcioneng: e.target.value })}
                        ></textarea>
                        <label>Categoría:</label>
                        <select value={editProductData.categoryId} onChange={(e) => setEditProductData({ ...editProductData, categoryId: e.target.value })}>
                            <option value="">Seleccionar categoría</option>
                            {categories && categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nombreesp} - {category.nombreeng}
                                </option>
                            ))}
                        </select>
                        <label>Editar Foto:</label>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleSaveEdit}>Guardar Cambios</button>
                    </div>
                </div>
            )}
        </div>


    );
};

export default AdminProduct;

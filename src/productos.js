import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Productos() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [nombreEsp, setNombreEsp] = useState('');
  const [nombreEng, setNombreEng] = useState('');
  const [descripcionEsp, setDescripcionEsp] = useState('');
  const [descripcionEng, setDescripcionEng] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [mesesProduccion, setMesesProduccion] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(''); // Producto seleccionado
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Realiza una solicitud GET para obtener las categorías
    axios.get('http://localhost:5000/categories')
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías', error);
      });

    // Realiza una solicitud GET para obtener los productos
    axios.get('http://localhost:5000/products')
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error('Error al obtener los productos', error);
      });
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleNombreEspChange = (event) => {
    setNombreEsp(event.target.value);
  };

  const handleNombreEngChange = (event) => {
    setNombreEng(event.target.value);
  };

  const handleDescripcionEspChange = (event) => {
    setDescripcionEsp(event.target.value);
  };

  const handleDescripcionEngChange = (event) => {
    setDescripcionEng(event.target.value);
  };

  const handleCategoriaChange = (event) => {
    setCategoriaId(event.target.value);
  };


  const handleUpload = async () => {
    if (selectedFile && nombreEsp && nombreEng && descripcionEsp && descripcionEng && categoriaId) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('nombreesp', nombreEsp);
      formData.append('nombreeng', nombreEng);
      formData.append('descripcionesp', descripcionEsp);
      formData.append('descripcioneng', descripcionEng);
      formData.append('categoria_id', categoriaId);

      for (const mes of mesesProduccion) {
        formData.append('meses_produccion', mes);
      }

      try {
        const response = await axios.post('http://localhost:5000/upload_product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          setUploadedFileName(response.data.message);
        } else {
          console.error('Error al cargar el producto con foto');
        }
      } catch (error) {
        console.error('Error al cargar el producto con foto', error);
      }
    }
  
  };

  const mesesDisponibles = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const [selectedMes, setSelectedMes] = useState('');
  
  const handleAddMes = () => {
    if (selectedProduct && selectedMes.length > 0) {
      const mesString = selectedMes.join(','); // Convierte el array en una cadena separada por comas
      const data = {
        mes: mesString, // Ahora 'mes' es una cadena
      };
  
      axios.post(`http://localhost:5000/productos/${selectedProduct}/meses/agregar`, data)
        .then((response) => {
          if (response.status === 200) {
            // Aquí puedes actualizar el estado o realizar cualquier otra acción
            console.log('Meses de producción agregados con éxito');
          } else {
            console.error('Error al agregar meses de producción');
          }
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud', error);
        });
    }
  };
          
  const handleRemoveMes = (productoId, mes) => {
    // Encuentra el producto seleccionado
    const product = products.find((p) => p.id === productoId);
  
    if (product) {
      // Filtra los meses de producción del producto para mantener solo los que no coinciden con el mes seleccionado
      product.mesesProduccion = product.mesesProduccion.filter((m) => m !== mes);
  
      // Actualiza el estado de productos
      const updatedProducts = [...products];
      setProducts(updatedProducts);
    }
  };
  
  const renderMesesProduccion = () => {
    return mesesProduccion.map((mes, index) => (
      <div key={index}>
        <span>{mes}</span>
        <button onClick={() => handleRemoveMes(mes)}>Eliminar</button>
      </div>
    ));
  };


  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <input type="text" placeholder="Nombre en español" onChange={handleNombreEspChange} />
        <input type="text" placeholder="Nombre en inglés" onChange={handleNombreEngChange} />
        <input type="text" placeholder="Descripción en español" onChange={handleDescripcionEspChange} />
        <input type="text" placeholder="Descripción en inglés" onChange={handleDescripcionEngChange} />
        <select onChange={handleCategoriaChange}>
          <option value="" disabled selected>Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.nombreesp}</option>
          ))}
        </select>
        <button onClick={handleUpload}>Subir producto con foto</button>
        {uploadedFileName && <p>Producto subido: {uploadedFileName}</p>}
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          <option value="" disabled>Selecciona un producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nombreesp}
            </option>
          ))}
        </select>

        <select multiple value={selectedMes} onChange={(e) => setSelectedMes(Array.from(e.target.selectedOptions, (option) => option.value))}>
  {mesesDisponibles.map((mes) => (
    <option key={mes} value={mes}>
      {mes}
    </option>
  ))}
        </select>
        <button onClick={handleAddMes}>Añadir Meses de Producción</button>
        {renderMesesProduccion()}

      </div>

      <h1>Productos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <p>Nombre en español: {product.nombreesp}</p>
            <p>Nombre en inglés: {product.nombreeng}</p>
            <p>Descripción en español: {product.descripcionesp}</p>
            <p>Descripción en inglés: {product.descripcioneng}</p>
            <p>Categoría ID: {product.categoria_id}</p>
            <img src={`http://localhost:5000/uploads/${product.foto}`} alt={product.nombreesp} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Productos;

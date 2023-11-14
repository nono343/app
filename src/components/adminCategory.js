import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCategory() {
  const token = localStorage.getItem("token");

  //subir categorias
  const [selectedFileCategory, setSelectedFileCategory] = useState(null);
  const [nombreEspCategory, setNombreEspCategory] = useState('');
  const [nombreEngCategory, setNombreEngCategory] = useState('');
  const [uploadedFileNameCategory, setUploadedFileNameCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/categories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setCategories(response.data.categories);
        console.log('Respuesta del servidor:', response);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías', error);
      });
  }, []);

  const handleFileChangeCategory = (event) => {
    setSelectedFileCategory(event.target.files[0]);
  };

  const handleNombreEspChangeCategory = (event) => {
    setNombreEspCategory(event.target.value);
  };

  const handleNombreEngChangeCategory = (event) => {
    setNombreEngCategory(event.target.value);
  };

  const handleUploadCategory = async () => {
    if (selectedFileCategory && nombreEspCategory && nombreEngCategory) {
      const formData = new FormData();
      formData.append('file', selectedFileCategory);
      formData.append('nombreesp', nombreEspCategory);
      formData.append('nombreeng', nombreEngCategory);

      try {
        const response = await axios.post('http://localhost:5000/upload_category', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
        if (response.status === 200) {
          setUploadedFileNameCategory(response.data.message);
          axios.get('http://localhost:5000/categories')
            .then((response) => {
              setCategories(response.data.categories);
            })
            .catch((error) => {
              console.error('Error al obtener las categorías después de cargar', error);
            });
        } else {
          console.error('Error al cargar la categoría con foto');
        }
      } catch (error) {
        console.error('Error al cargar la categoría con foto', error);
      }
    }
  };


  //subir productos

  const [selectedFileProduct, setSelectedFileProduct] = useState(null);
  const [uploadedFileNameProduct, setUploadedFileNameProduct] = useState('');
  const [nombreEspProduct, setNombreEspProduct] = useState('');
  const [nombreEngProduct, setNombreEngProduct] = useState('');
  const [descripcionEsp, setDescripcionEsp] = useState('');
  const [descripcionEng, setDescripcionEng] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products when component mounts
    axios.get('http://localhost:5000/productos')
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error al obtener la lista de productos:', error));
  }, []);

  const handleFileChangeProduct = (event) => {
    setSelectedFileProduct(event.target.files[0]);
  };

  const handleNombreEspChangeProduct = (event) => {
    setNombreEspProduct(event.target.value);
  };

  const handleNombreEngChangeProduct = (event) => {
    setNombreEngProduct(event.target.value);
  };

  const handleDescripcionEspChange = (event) => {
    setDescripcionEsp(event.target.value);
  };

  const handleDescripcionEngChange = (event) => {
    setDescripcionEng(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleUploadProduct = async () => {
    if (selectedFileProduct && nombreEspProduct && nombreEngProduct && categoryId) {
      const formData = new FormData();
      formData.append('file', selectedFileProduct);
      formData.append('nombreesp', nombreEspProduct);
      formData.append('nombreeng', nombreEngProduct);
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
          setUploadedFileNameProduct(response.data.message);

          // Fetch the updated list of products right after successful upload
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
        console.log(error.response.data);
      }
    }
  };
  // ...



  //subir meses 

  const [selectedMonths, setSelectedMonths] = useState([]);
  const [productId, setProductId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/productos')
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error al obtener la lista de productos:', error));
  }, []);

  const handleProductChange = (event) => {
    setProductId(event.target.value);
  };

  const handleCheckboxChange = (month) => {
    const updatedMonths = selectedMonths.includes(month)
      ? selectedMonths.filter(selectedMonth => selectedMonth !== month)
      : [...selectedMonths, month];

    setSelectedMonths(updatedMonths);

    // Actualizar la lista de productos cuando cambian los meses
    if (productId) {
      axios.get(`http://localhost:5000/productos/${productId}/meses`, {
        params: { meses: updatedMonths.join(',') }
      })
        .then(response => setProducts(response.data.products))
        .catch(error => console.error('Error al obtener la lista de productos después de agregar meses:', error));
    }
  };

  const handleAgregarMeses = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/productos/${productId}/meses/agregar`, { meses: selectedMonths });

      console.log('Respuesta del servidor:', response.data);
      console.log('Meses de producción agregados con éxito', response.data);

      // Actualizar la lista de productos después de agregar meses
      axios.get('http://localhost:5000/productos')
        .then(response => setProducts(response.data.products))
        .catch(error => console.error('Error al obtener la lista de productos después de agregar meses:', error));
    } catch (error) {
      // ... (rest of your error handling code)
    }
  };

  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChangeCategory} />
        <input type="text" placeholder="Nombre en español" onChange={handleNombreEspChangeCategory} />
        <input type="text" placeholder="Nombre en inglés" onChange={handleNombreEngChangeCategory} />
        <button onClick={handleUploadCategory}>Subir categoría con foto</button>
        {uploadedFileNameCategory && <p>Categoría subida: {uploadedFileNameCategory}</p>}
      </div>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <strong>{category.nombreesp}</strong> - {category.nombreeng}
            {category.foto && (
              <img src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} />
            )}
            {/* Assuming these functions are implemented */}
          </li>
        ))}
      </ul>

      <div>
        <input type="file" onChange={handleFileChangeProduct} />
        <input type="text" placeholder="Nombre en español" onChange={handleNombreEspChangeProduct} />
        <input type="text" placeholder="Nombre en inglés" onChange={handleNombreEngChangeProduct} />
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
        <button onClick={handleUploadProduct}>Subir producto con foto</button>
        {uploadedFileNameProduct && <p>Producto subido: {uploadedFileNameProduct}</p>}

        <ul>
          {products.map(product => (
            <li key={product.id}>
              <strong>{product.nombreesp}</strong> - {product.nombreeng}
              {product.foto && (
                <img src={`http://localhost:5000/uploads/${product.foto}`} alt={product.nombreesp} />
              )}
              {/* Assuming these functions are implemented */}
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
      </div>
      <div>
        <h2>Agregar Meses de Producción</h2>
        <label>
        Producto:
        <select value={productId} onChange={handleProductChange}>
          <option value="">Seleccionar producto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.nombreesp} - {product.nombreeng}
            </option>
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
        <button onClick={handleAgregarMeses}>
          Agregar Meses
        </button>
      </div>
    </div>
  );
}

export default AdminCategory;

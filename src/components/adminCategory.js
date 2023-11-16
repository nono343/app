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

  const [mostrarFormularioCategorias, setMostrarFormularioCategorias] = useState(false);

  const toggleFormularioCategorias = () => {
    setMostrarFormularioCategorias(!mostrarFormularioCategorias);
    setMostrarFormularioProductos(false);


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

  const [mostrarFormularioProductos, setMostrarFormularioProductos] = useState(false);

  const toggleFormularioProductos = () => {
    setMostrarFormularioProductos(!mostrarFormularioProductos);

    // Cerrar siempre mostrarFormularioCategorias al abrir mostrarFormularioProductos
    setMostrarFormularioCategorias(false);
  };

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
    // Clona el array de selectedMonths para no mutar el estado directamente
    const updatedMonths = [...selectedMonths];

    // Verifica si el mes ya está en la lista
    const index = updatedMonths.indexOf(month);

    // Si el mes está en la lista, lo quita; de lo contrario, lo agrega
    if (index !== -1) {
      updatedMonths.splice(index, 1);
    } else {
      updatedMonths.push(month);
    }

    // Actualiza el estado con el nuevo array
    setSelectedMonths(updatedMonths);
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

  //subir packaging

  const [mostrarFormularioPackaging, setMostrarFormularioPackaging] = useState(false);

  const toggleFormularioPackaging = () => {
    setMostrarFormularioPackaging(!mostrarFormularioPackaging);
    setMostrarFormularioCategorias(false);
    setMostrarFormularioProductos(false);

  };


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

  const handlePackagingCheckboxChange = (id, type) => {
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
  
      // Agrega el ID del producto al formData
      formData.append('producto_id', productIds);
  
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



  // Define handleSelectPackagingChange function
  const handleSelectPackagingChange = (selectedProductId, type) => {
    // Implement your logic here
    console.log('Selected Product ID:', selectedProductId);
    // Update the state or perform other actions as needed
    setProductIds([selectedProductId]);
  };



  return (

    <div>
      <div className="sm:flex sm:justify-center mb-5 lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a onClick={toggleFormularioCategorias}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
                Categorías
              </a>
            </li>
            <li>
              <a onClick={toggleFormularioProductos}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Productos
              </a>
            </li>
            <li>
              <a onClick={toggleFormularioPackaging}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                Packaging
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sm:flex sm:justify-center mb-5 hidden">
        <ul className="menu  lg:menu-horizontal rounded-box">
          <li>
            <a onClick={toggleFormularioCategorias}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
              </svg>
              Categorías
            </a>
          </li>
          <li>
            <a onClick={toggleFormularioProductos}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Productos
            </a>
          </li>
          <li>
            <a onClick={toggleFormularioPackaging}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>

              Packaging
            </a>
          </li>
        </ul>
      </div>

      {mostrarFormularioCategorias && (

        <div>
          {/* {uploadedFileNameCategory &&
                <div className="alert alert-success max-w-screen-sm mx-auto mb-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Categoria subida</span>
                </div>
              } */}
          <form className="grid md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_esp">
                <span className="label-text">Nombre categoría español</span>
              </label>
              <input type="text" id="name_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre" onChange={handleNombreEspChangeCategory} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_eng">
                <span className="label-text">Nombre categoría ingles</span>
              </label>
              <input type="text" id="name_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre" onChange={handleNombreEngChangeCategory} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Foto categría</span>
              </label>
              <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChangeCategory} required />
            </div>

            <div className='mx-auto md:col-start-2'>
              <button onClick={handleUploadCategory} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Crear Categoría</button>
            </div>
          </form>

          <div className="max-w-screen-xl mx-auto overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Nombre Inglés</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>
                      {category.foto && (
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} />
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{category.nombreesp}</strong>
                    </td>
                    <td>{category.nombreeng}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {mostrarFormularioProductos && (

        <div>
          {/* {uploadedFileNameCategory &&
                <div className="alert alert-success max-w-screen-sm mx-auto mb-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Categoria subida</span>
                </div>
              } */}
          <form className="grid md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_esp">
                <span className="label-text">Nombre producto español</span>
              </label>
              <input type="text" id="name_product_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre" onChange={handleNombreEspChangeProduct} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_eng">
                <span className="label-text">Nombre producto ingles</span>
              </label>
              <input type="text" id="name_product_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre" onChange={handleNombreEngChangeProduct} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_eng">
                <span className="label-text">Descripción producto español</span>
              </label>
              <input type="text" id="description_product_esp" className="input input-bordered w-full max-w-xs" placeholder="Descripción" onChange={handleDescripcionEspChange} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_eng">
                <span className="label-text">Descripción producto ingles</span>
              </label>
              <input type="text" id="description_product_eng" className="input input-bordered w-full max-w-xs" placeholder="Descripción" onChange={handleDescripcionEngChange} required />
            </div>

            <div className='form-control w-full max-w-xs"'>
              <label className="label">
                <span className="label-text">Categoría</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={categoryId}
                onChange={handleCategoryChange}
              >
                <option value="" disabled>Seleccionar categoría</option>
                {categories && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nombreesp} - {category.nombreeng}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Foto producto</span>
              </label>
              <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChangeProduct} required />
            </div>


            <div className='mx-auto md:col-start-2'>
              <button onClick={handleUploadProduct} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Crear Producto</button>
            </div>
          </form>
          {/* agregar meses */}
          <form className="grid md:grid-cols gap-6 max-w-screen-xl mx-auto">
            <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre producto español</label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={productId}  // Cambié productId por el valor correcto
                onChange={handleProductChange}  // Cambié handleProductChange por el valor correcto
              >
                <option value="" disabled>Seleccionar producto</option>
                {products && products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.nombreesp} - {product.nombreeng}
                  </option>
                ))}
              </select>
            </div>

            <div className='max-w-screen-md'>
              <label htmlFor="monthSelector" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Meses de producción:
              </label>

              <ul className="flex items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <li key={month} className="w-full border-r last:border-r-0 border-gray-200 dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input
                        id={`month-${month}`}
                        type="checkbox"
                        value={month}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleCheckboxChange(month)}
                      />
                      <label
                        htmlFor={`month-${month}`}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >{`${month}`}</label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </form>
          <div className='flex justify-center mt-5'>
            <button onClick={handleAgregarMeses} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mb-5">Añadir meses</button>
          </div>


          <div className="max-w-screen-xl mx-auto overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Nombre Inglés</th>
                  <th>Descripción</th>
                  <th>Descripción Inglés</th>
                  <th>Meses de Producción</th>

                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.foto && (
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={`http://localhost:5000/uploads/${product.foto}`} alt={product.nombreesp} />
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {product.nombreesp}
                    </td>
                    <td>
                      {product.nombreeng}
                    </td>
                    <td>
                      {product.descripcionesp}
                    </td>
                    <td>
                      {product.descripcioneng}
                    </td>
                    <td>
                      {product.meses_de_produccion.map(mes => (
                        <span key={mes.id}>{mes.mes} </span>
                      ))}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {mostrarFormularioPackaging && (

        <div>
          <form className="grid md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_esp">
                <span className="label-text">Nombre Packaging Español</span>
              </label>
              <input type="text" id="name_packaging_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre Español" onChange={(e) => setNombreEsp(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="name_eng">
                <span className="label-text">Nombre Packaging Inglés</span>
              </label>
              <input type="text" id="name_packaging_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre Ingles" onChange={(e) => setNombreEng(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="presentacion">
                <span className="label-text">Presentación</span>
              </label>
              <input type="text" id="presentacion" className="input input-bordered w-full max-w-xs" placeholder="Presentación" onChange={(e) => setPresentacion(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="calibre">
                <span className="label-text">Calibre</span>
              </label>
              <input type="text" id="calibre" className="input input-bordered w-full max-w-xs" placeholder="Calibre" onChange={(e) => setCalibre(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="pesopresentacion">
                <span className="label-text">Peso Presentación</span>
              </label>
              <input type="text" id="pesopresentacion" className="input input-bordered w-full max-w-xs" placeholder="Peso Neto Presentación" onChange={(e) => setPesoPresentacion(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="pesoneto">
                <span className="label-text">Peso Neto (kg)</span>
              </label>
              <input type="text" id="pesoneto" className="input input-bordered w-full max-w-xs" placeholder="Peso Neto" onChange={(e) => setPesoNeto(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="tamanocaja">
                <span className="label-text">Tamaño Caja</span>
              </label>
              <input type="text" id="tamanocaja" className="input input-bordered w-full max-w-xs" placeholder="Tamaño Caja" onChange={(e) => setTamanoCaja(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="pallet80x120">
                <span className="label-text">pallet80x120</span>
              </label>
              <input type="text" id="pallet80x120" className="input input-bordered w-full max-w-xs" placeholder="Pallet 80x120" onChange={(e) => setPallet80x120(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="pesoNetoPallet80x120">
                <span className="label-text">pesoNetoPallet80x120</span>
              </label>
              <input type="text" id="pesoNetoPallet80x120" className="input input-bordered w-full max-w-xs" placeholder="Peso Neto Pallet 80x120" onChange={(e) => setPesoNetoPallet80x120(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="pallet100x120">
                <span className="label-text">pallet100x120</span>
              </label>
              <input type="text" id="pallet100x120" className="input input-bordered w-full max-w-xs" placeholder="Pallet 80x120" onChange={(e) => setPallet100x120(e.target.value)} required />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" for="pesoNetoPallet100x120">
                <span className="label-text">pesoNetoPallet100x120</span>
              </label>
              <input type="text" id="pesoNetoPallet100x120" className="input input-bordered w-full max-w-xs" placeholder="Peso Neto Pallet 80x120" onChange={(e) => setPesoNetoPallet100x120(e.target.value)} required />
            </div>


            {availableProducts.length > 0 && (
              <div>
                <p>Productos disponibles:</p>
                <select
                  value={productIds}
                  onChange={(e) => {
                    const selectedProductId = e.target.value;
                    setProductIds(selectedProductId);
                  }}
                >
                  <option value="">Selecciona un producto</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={String(product.id)}>
                      {product.nombreesp}
                    </option>
                  ))}
                </select>
              </div>
            )}


            {/* Mostrar nombres de usuarios disponibles */}
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
                          onChange={() => handlePackagingCheckboxChange(user.id, 'user')}
                          checked={userIds.includes(String(user.id))} // Convertir a cadena para la comparación
                        />
                        {user.username}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}



            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Foto producto</span>
              </label>
              <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange} required />
            </div>


            <div className='mx-auto md:col-start-2'>
              <button onClick={handleSubmit} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Crear Packaging</button>
            </div>
          </form>
        </div>
      )}



    </div>
  );
}

export default AdminCategory;

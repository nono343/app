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

  //subir packaging


  const [selectedFilePackaging, setSelectedFilePackaging] = useState(null);
  const [uploadedFileNamePackaging, setUploadedFileNamePackaging] = useState('');
  const [nombreEspPackaging, setNombreEspPackaging] = useState('');
  const [nombreEngPackaging, setNombreEngPackaging] = useState('');
  const [presentacionPackaging, setPresentacionPackaging] = useState('');
  const [calibrePackaging, setCalibrePackaging] = useState('');
  const [pesoPresentacionGPackaging, setPesoPresentacionGPackaging] = useState('');
  const [pesoNetoKgPackaging, setPesoNetoKgPackaging] = useState('');
  const [tamanoCajaPackaging, setTamanoCajaPackaging] = useState('');
  const [pallet80x120Packaging, setPallet80x120Packaging] = useState('');
  const [pesoNetoPallet80x120KgPackaging, setPesoNetoPallet80x120KgPackaging] = useState('');
  const [pallet100x120Packaging, setPallet100x120Packaging] = useState('');
  const [pesoNetoPallet100x120KgPackaging, setPesoNetoPallet100x120KgPackaging] = useState('');
  const [usersPackaging, setUsersPackaging] = useState([]);  // Added state for users
  const [selectedUserId, setSelectedUserId] = useState('');  // State to store the selected user ID
  const [selectedProductId, setSelectedProductId] = useState('');  // State to store the selected product ID


  useEffect(() => {

    axios.get('http://localhost:5000/users')
      .then((response) => {
        setUsersPackaging(response.data.users);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios', error);
      });

  }, []);


  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleUpload = async () => {
    if (selectedFilePackaging && nombreEspPackaging && nombreEngPackaging && productId && selectedUserId) {
      const formData = new FormData();
      formData.append('file', selectedFilePackaging);
      formData.append('nombreesp', nombreEspPackaging);
      formData.append('nombreeng', nombreEngPackaging);
      formData.append('presentacion', presentacionPackaging);
      formData.append('calibre', calibrePackaging);
      formData.append('peso_presentacion_g', pesoPresentacionGPackaging);
      formData.append('peso_neto_kg', pesoNetoKgPackaging);
      formData.append('tamano_caja', tamanoCajaPackaging);
      formData.append('pallet_80x120', pallet80x120Packaging);
      formData.append('peso_neto_pallet_80x120_kg', pesoNetoPallet80x120KgPackaging);
      formData.append('pallet_100x120', pallet100x120Packaging);
      formData.append('peso_neto_pallet_100x120_kg', pesoNetoPallet100x120KgPackaging);
      formData.append('producto_id', selectedProductId);  // Added product ID
      formData.append('user_id', selectedUserId);  // Added user ID

      try {
        const response = await axios.post('http://localhost:5000/upload_packaging', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setUploadedFileNamePackaging(response.data.message);

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

  const handleFileChange = (event) => {
    setSelectedFilePackaging(event.target.files[0]);
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
              <a>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Productos
              </a>
            </li>
            <li>
              <a>
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
            <a>
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
            <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre categoría español</label>
              <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" onChange={handleNombreEspChangeCategory} required />
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre categoría ingles</label>
              <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" onChange={handleNombreEngChangeCategory} required />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Foto categoría</label>
              <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleFileChangeCategory} />
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
            <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre producto español</label>
              <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" onChange={handleNombreEspChangeProduct} required />
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre producto ingles</label>
              <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" onChange={handleNombreEngChangeProduct} required />
            </div>
            <div>
              <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción producto español</label>
              <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" onChange={handleDescripcionEspChange} required />
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción producto ingles</label>
              <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" onChange={handleDescripcionEngChange} required />
            </div>
            <div>
              <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoría</label>
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
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Foto producto</label>
              <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleFileChangeProduct} />
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

            <div>
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
            <button onClick={handleAgregarMeses} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Añadir meses</button>
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
                      {product.mesproduccion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <strong>{product.nombreesp}</strong> - {product.nombreeng}
              {product.foto && (
                <img src={`http://localhost:5000/uploads/${product.foto}`} alt={product.nombreesp} />
              )}

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

      <div>
        <input type="file" onChange={handleFileChange} />
        <input type="text" placeholder="Nombre en español" onChange={(e) => setNombreEspPackaging(e.target.value)} />
        <input type="text" placeholder="Nombre en inglés" onChange={(e) => setNombreEngPackaging(e.target.value)} />
        <input type="text" placeholder="Presentación" onChange={(e) => setPresentacionPackaging(e.target.value)} />
        <input type="text" placeholder="Calibre" onChange={(e) => setCalibrePackaging(e.target.value)} />
        <input type="text" placeholder="Peso Presentación (g)" onChange={(e) => setPesoPresentacionGPackaging(e.target.value)} />
        <input type="text" placeholder="Peso Neto (kg)" onChange={(e) => setPesoNetoKgPackaging(e.target.value)} />
        <input type="text" placeholder="Tamaño Caja" onChange={(e) => setTamanoCajaPackaging(e.target.value)} />
        <input type="text" placeholder="Pallet 80x120" onChange={(e) => setPallet80x120Packaging(e.target.value)} />
        <input type="text" placeholder="Peso Neto Pallet 80x120 (kg)" onChange={(e) => setPesoNetoPallet80x120KgPackaging(e.target.value)} />
        <input type="text" placeholder="Pallet 100x120" onChange={(e) => setPallet100x120Packaging(e.target.value)} />
        <input type="text" placeholder="Peso Neto Pallet 100x120 (kg)" onChange={(e) => setPesoNetoPallet100x120KgPackaging(e.target.value)} />
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
        <label>
          Usuario:
          <select value={selectedUserId} onChange={handleUserChange}>
            <option value="">Seleccionar usuario</option>
            {usersPackaging.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleUpload}>Subir packaging con foto</button>
        {uploadedFileNamePackaging && <p>Packaging uploaded: {uploadedFileNamePackaging}</p>}
      </div>

    </div>
  );
}

export default AdminCategory;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ProductosPorCategoria = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [categoriaNombre, setCategoriaNombre] = useState('');

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      try {
        const response = await axios.get(`/categories/${id}`);
        const data = response.data;
        setCategoriaNombre(data.category);
        setProductos(data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductosPorCategoria();
  }, [id]);

  return (
    <div className="relative text-center py-5 animate-fade-down">
      <div className="container m-auto px-6 text-gray-500 md:px-12">
        <h2 className="mb-5 text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
          {categoriaNombre}
        </h2>

        <div className="grid gap-6 md:mx-auto md:w-8/12 lg:w-full lg:grid-cols-3">
          {productos.map((producto) => (
            <Link
              key={producto.id}
              to={`/categories/${id}/productos/${producto.id}`}
              className="group space-y-1 border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 py-12 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-red-400"
            >
              <img className="mx-auto w-120" src={`http://localhost:5000/uploads/${producto.foto}`} alt={producto.nombreesp} loading="lazy" />
              <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                {producto.nombreesp}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductosPorCategoria;

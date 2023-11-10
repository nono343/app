import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';



export default function Inicio() {
    const location = useLocation();
    const [categories, setCategories] = useState([]);

    // ...

    useEffect(() => {
        axios.get('http://localhost:5000/categories')
            .then((response) => {
                setCategories(response.data.categories);
                console.log('Rutas de imágenes:', response.data.categories.map(category => `http://localhost:5000/uploads/${category.foto}`));
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });
    }, []);



    return (
        <div className="relative py-5">
            <div className="container relative m-auto px-6 text-gray-500 md:px-12">
                <div className="grid gap-6 md:mx-auto md:w-8/12 lg:w-full lg:grid-cols-3 animate-fade">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/categories/${category.id}`}
                            className="group space-y-1 border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 py-12 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-red-400"
                        >
                            <img className="mx-auto w-120" src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} loading="lazy" />
                            <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                                {category.nombreesp}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import { XIcon as XMarkIcon } from '@heroicons/react/outline';

const DetalleProducto = () => {
    const { store, actions } = useContext(Context);
    const { categoria_id, producto_id } = useParams();
    const [producto, setProducto] = useState(null);
    const { isLoggedIn, user } = store;
    const { id, username, is_admin } = user;
    const [sortOrder, setSortOrder] = useState('asc');
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchProductoPorId = async () => {
            try {
                const response = await axios.get(`/categorias/${categoria_id}/productos/${producto_id}`);
                const data = response.data;
                setProducto(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProductoPorId();
    }, [categoria_id, producto_id]);

    if (!producto) {
        return <div>Loading...</div>; // Puedes personalizar el indicador de carga
    }

    console.log('Datos del producto:', producto);

    const userId = id; // Reemplaza esto con la lógica real para obtener el ID del usuario actual

    const handleSort = (column) => {
        const sortOrderToggle = sortOrder === 'asc' ? 'desc' : 'asc';

        const sortedProducts = producto.producto.packagings.sort((a, b) => {
            const numA = parseFloat(a[column].replace(',', '.').trim());
            const numB = parseFloat(b[column].replace(',', '.').trim());

            return sortOrderToggle === 'asc' ? numA - numB : numB - numA;
        });

        setSortOrder(sortOrderToggle);
        setProducto({ ...producto, producto: { ...producto.producto, packagings: sortedProducts } });
    };

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setIsImageEnlarged(true);
    };

    const closeImageModal = () => {
        setIsImageEnlarged(false);
    };

    return (
        <div className='max-w-screen-2xl mx-auto'>
            {/* // Sección de información del producto */}
            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 animate-fade-right">
                        <img
                            src={`http://localhost:5000/uploads/${producto.producto.foto || ''}`}
                            alt={producto.producto.nombreesp || ''}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center animate-fade-left">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                            {producto.producto.nombreesp || ''}
                        </h1>
                        <p className="mb-8 leading-relaxed">{producto.producto.descripcionesp || ''}</p>
                    </div>
                </div>
            </section>

            {/* // Calendario de producción */}
            <section>
                <div className="border-t mx-auto border-gray-200 bg-white px-10 py-10 sm:px-6 animate-fade-up">
                    <h1 className="sm:text-3xl text-center text-2xl mb-5">
                        Calendario de producción
                    </h1>
                    <div className="flex justify-center max-w-screen-md mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes, index) => (
                            <a
                                key={index}
                                className={`relative inline-flex w-1/12 sm:w-1/12 mr-1 h-16 ${producto.meses_produccion.map(m => m.mes).includes(mes.toString())
                                    ? 'bg-red-600'
                                    : 'bg-gray-200'
                                    } mb-2 flex items-center justify-center text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transform hover:scale-110 transition-transform`}
                            >
                                {mes}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tabla de packagings */}
            <section>
                <div className="relative overflow-x-auto shadow-md rounded-lg max-h-80 animate-fade-up">
                    <table className="w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
                        <thead className="text-xs cursor-pointer text-white uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="sticky left-0 top-0 z-10 w-1/20 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Packaging')}>
                                    Embalaje
                                </th>
                                {/* Resto de las columnas */}
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Presentation')}>
                                    Formato
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Calibre
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Peso Presentación (g)
                                </th>
                                {/* Agregar títulos para todos los campos de packaging */}
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Peso Neto (kg)
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Tamaño Caja
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Pallet 80x120
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Peso Neto Pallet 80x120 (kg)
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Pallet 100x120
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Peso Neto Pallet 100x120 (kg)
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    Foto
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {producto.packagings ? (
                                producto.packagings
                                    .filter((packaging) => packaging.users.some(user => user.id === userId))
                                    .map((packaging, index) => (
                                        <tr className="bg-white" key={index}>
                                            {/* Resto de las columnas */}
                                            <td className="w-1/20 text-white px-4 sm:px-6 sticky left-0 py-3 bg-red-600">
                                                {packaging.nombreesp}
                                            </td>
                                            {/* Resto de las columnas */}
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.presentacion}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.calibre}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.peso_presentacion_g}
                                            </td>
                                            {/* Agregar celdas para todos los campos de packaging */}
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.peso_neto_kg}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.tamano_caja}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.pallet_80x120}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.peso_neto_pallet_80x120_kg}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.pallet_100x120}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                {packaging.peso_neto_pallet_100x120_kg}
                                            </td>
                                            <td className="px-4 sm:px-6 py-3">
                                                <img
                                                    src={`http://localhost:5000/uploads/${packaging.foto || ''}`}
                                                    alt="Packaging"
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                    onClick={() => openImageModal(index)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">No hay datos disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal de imagen */}
                {isImageEnlarged && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="relative z-10">
                            <img
                                src={`http://localhost:5000/uploads/${producto.producto.packagings[selectedImageIndex]?.foto}`}
                                alt="Large Packaging"
                                className="w-full h-full max-w-screen-md sm:max-w-screen-lg object-contain cursor-pointer animate-fade"
                                onError={(e) => console.error("Image failed to load:", e)}
                            />
                            <div className="absolute top-4 right-4">
                                <XMarkIcon
                                    className="text-red-900 w-6 h-6 cursor-pointer"
                                    onClick={() => setIsImageEnlarged(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DetalleProducto;

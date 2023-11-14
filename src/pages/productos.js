import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import { XIcon as XMarkIcon } from '@heroicons/react/outline';



const DetalleProducto = () => {
    const { store, actions } = useContext(Context);
    const { categoriaId, productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const { isLoggedIn, user } = store;
    const { id, username, is_admin } = user;
    const [sortOrder, setSortOrder] = useState('asc');
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);


    useEffect(() => {
        const fetchDetalleProducto = async () => {
            try {
                const response = await axios.get(`/categories/${categoriaId}/productos/${productoId}`);
                const data = response.data;
                setProducto(data.product);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDetalleProducto();
    }, [categoriaId, productoId]);

    if (!producto) {
        return <p>Cargando...</p>;
    }

    console.log('Datos del producto:', producto);

    // Supongamos que obtienes el ID del usuario actual de algún lugar (por ejemplo, de la autenticación)
    const userId = id;  // Reemplaza esto con la lógica real para obtener el ID del usuario actual


    const handleSort = (column) => {
        const sortOrderToggle = sortOrder === 'asc' ? 'desc' : 'asc';

        const sortedProducts = producto.packagings.sort((a, b) => {
            const numA = parseFloat(a[column].replace(',', '.').trim());
            const numB = parseFloat(b[column].replace(',', '.').trim());

            if (sortOrderToggle === 'asc') {
                return numA - numB;
            } else {
                return numB - numA;
            }
        });

        setSortOrder(sortOrderToggle);
        setProducto({ ...producto, packagings: sortedProducts });
    };

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setIsImageEnlarged(true);
    };

    const closeImageModal = () => {
        setIsImageEnlarged(false);
    };

    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 animate-fade-right">
                        <img
                            src={`http://localhost:5000/uploads/${producto.foto}`}
                            alt={producto.nombreesp}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center animate-fade-left">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                            {producto.nombreesp}
                        </h1>
                        <p className="mb-8 leading-relaxed">{producto.descripcionesp}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="border-t mx-auto border-gray-200 bg-white px-10 py-10 sm:px-6 animate-fade-up">
                    <h1 className="sm:text-3xl text-center text-2xl mb-5">
                        Calendario de producción
                    </h1>
                    <div className="flex justify-center max-w-screen-md mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes, index) => (
                            <a
                                key={index}
                                className={`relative inline-flex w-1/12 sm:w-1/12 mr-1 h-16 ${producto.meses_produccion.includes(mes.toString())
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

            <section>
                <div className="relative overflow-x-auto shadow-md rounded-lg max-h-80 animate-fade-up">
                    <table className="w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
                        <thead className="text-xs cursor-pointer text-white uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="sticky left-0 top-0 z-10 w-1/20 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Packaging')}>
                                    {/* {isSpanish ? "Embalaje" : "Packaging"} */} Embalaje
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Presentation')}>
                                    {/* {isSpanish ? "Formato" : "Presentation"} */} Formato
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Calibre')}>
                                    {/* {isSpanish ? "Formato" : "Presentation"} */} Calibre
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Presentation Weight (g)')}>
                                    {/* {isSpanish ? "Peso del formato" : "Presentation Weight (g)"} */} Peso del formato
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Net Weight (kg)')}>
                                    {/* {isSpanish ? "Peso neto (kg)" : "Net Weight (kg)"} */} Peso neto
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Box size')}>
                                    {/* {isSpanish ? "Medidas caja" : "Box size"} */} Medidas caja
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('80x120')}>
                                    {/* {isSpanish ? "80x120 Cajas/Palet" : "80x120 Boxes/Palet"} */} 80x120 Cajas/Palet
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Net Weight 80x120 (Kg)')}>
                                    {/* {isSpanish ? "Peso del palet (Kg)" : "Palet net weight (Kg)"} */} Peso del palet (Kg)
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('100x120')}>
                                    {/* {isSpanish ? "100x120 Cajas/Palet" : "100x120 Boxes/Palet"} */} 100x120 Cajas/Palet
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600" onClick={() => handleSort('Net Weight 100x120 (Kg)')}>
                                    {/* {isSpanish ? "Peso del palet (Kg)" : "Palet net weight (Kg)"} */} Peso del palet (Kg)
                                </th>
                                <th scope="col" className="sticky top-0 z-10 px-4 sm:px-6 py-3 bg-red-600">
                                    {/* {isSpanish ? "Imagen" : "Image"} */} Foto
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {producto.packagings.map((packaging, index) => (
                                // Verificar si el packaging pertenece al usuario actual
                                (packaging.user_id === userId) && (
                                    <tr className="bg-white" key={index}>
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
                                                src={`http://localhost:5000/uploads/${packaging.foto}`}
                                                alt="Packaging"
                                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                onClick={() => openImageModal(index)}
                                            />
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
                {isImageEnlarged && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="relative z-10">
                            <img
                                src={`http://localhost:5000/uploads/${producto.packagings[selectedImageIndex]?.foto}`}
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



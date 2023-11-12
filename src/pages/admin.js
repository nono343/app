import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminCategory from '../components/adminCategory';
import AdminPackaging from '../components/adminPackaging';
import AdminProduct from '../components/adminProduct';
import { Context } from '../store/appContext';

export default function Admin() {
    const { store } = useContext(Context); // Asegúrate de tener tu contexto correctamente

    return (
        <div className='Admin'>
            {store.user && store.user.is_admin === 'admin' ? (
                <div>
                    {/* Mostrar otros componentes de administrador solo si el usuario es administrador */}
                    <AdminCategory />
                    <AdminProduct />
                    <AdminPackaging />
                </div>
            ) : (
                <div>
                    <p>Solo los administradores pueden acceder a esta ruta.</p>
                    {/* Puedes agregar un enlace o redirección adicional si es necesario */}
                </div>
            )}
        </div>
    );
}

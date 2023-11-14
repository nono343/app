import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminCategory from '../components/adminCategory';
import AdminPackaging from '../components/adminPackaging';
import AdminProduct from '../components/adminProduct';
import { Context } from '../store/appContext';
import AdminProductionMonth from '../components/adminProductionMonth';

export default function Admin() {
    const { store } = useContext(Context); // Asegúrate de tener tu contexto correctamente

    return (
        <div className='Admin'>
                <div>
                    <AdminCategory />
                    {/* <AdminProduct />
                    <AdminProductionMonth />
                    <AdminPackaging /> */}
                </div>
        </div>
    );
}

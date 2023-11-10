import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminCategory from '../components/adminCategory';
import AdminPackaging from '../components/adminPackaging';
import AdminProduct from '../components/adminProduct';



export default function Admin() {

    return (
        <div className='Admin'>
        <AdminCategory />
        <AdminProduct />
        <AdminPackaging />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AdminCategory from './components/adminCategory';
import AdminProducts from './components/adminProduct';
import AdminPackaging from './components/adminPackaging';
import Register from './components/register';

function App() {
  return (
    <div className='App'>
      <Register />
      <AdminCategory />
      <AdminProducts />
      <AdminPackaging />
    </div>
  );
}

export default App;

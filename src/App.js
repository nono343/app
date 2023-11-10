import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Register from './components/register';
import Inicio from './pages/inicio';
import Admin from './pages/admin';
import Login from './components/login';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='App'>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<Inicio/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

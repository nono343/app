import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Register from './components/register';
import Inicio from './pages/inicio';
import Admin from './pages/admin';
import Login from './components/login';
import Logout from './components/logout';
import injectContext from './store/appContext';
import { Context } from './store/appContext';
import ProductosPorCategoria from './pages/categorias';
import DetalleProducto from './pages/productos';
import Aaa from './components/aaa';

function App() {
  // Accede al contexto
  const { store, actions } = useContext(Context);

  // Ejemplo de cómo puedes acceder a los valores del store
  const { isLoggedIn, user } = store;
  const { id, username, is_admin } = user;

  // Console logs para comprobar la información
  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('username:', username);
    console.log('is_admin:', is_admin);
  }, [isLoggedIn, username, is_admin]);

  return (
    <div>
      <Router>
        {/* Renderiza el Navbar solo si el usuario está logueado */}
        {isLoggedIn && <Navbar />}

        <div className='App'>
          <Routes>
            <Route path="/aaa" element={<Aaa />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={isLoggedIn ? <Navigate to="/inicio" /> : <Login />}
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/categories/:id" element={<ProductosPorCategoria />} />
            <Route path="/categories/:categoriaId/productos/:productoId" element={<DetalleProducto />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default injectContext(App);

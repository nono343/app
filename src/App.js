import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Register from './components/register';
import Inicio from './pages/inicio';
import Admin from './pages/admin';
import Login from './components/login';
import injectContext from './store/appContext';
import { Context } from './store/appContext';

function App() {

  // Contexto global
  const { store, actions } = React.useContext(Context);

  // useEffect(() => {
  //   console.log("Store before calling valide_token:", store);
  //   actions.validate_token(store.token);
  // }, [actions, store.token]);
    
  return (
    <div>
      <Router>
        <Navbar actions={actions} />
        <div className='App'>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default injectContext(App);

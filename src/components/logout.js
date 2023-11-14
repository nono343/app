import React, { useContext } from 'react';
import { Context } from '../store/appContext'; // Ajusta la ruta según la estructura de tu proyecto

const Logout = () => {
  const { actions } = useContext(Context);

  const handleLogout = async () => {
    try {
      // Llama a la acción de logout desde el contexto
      await actions.logout();
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error al intentar cerrar sesión:', error);
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Logout;

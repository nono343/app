import React, { useState } from 'react';
import { Context } from '../store/appContext';  // Ajusta la ruta según tu estructura de carpetas

const Register = () => {
  const { actions } = React.useContext(Context);  // Utiliza el hook useContext para acceder al contexto
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Verifica si la acción registerUser está definida antes de llamarla
    if (actions && actions.registerUser) {
      await actions.registerUser(username, password);
    } else {
      console.error("La acción registerUser no está definida en las propiedades de acciones.");
    }

    // Puedes agregar lógica adicional aquí, como redirigir al usuario a la página de inicio de sesión después del registro exitoso
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <label>
          Usuario:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;

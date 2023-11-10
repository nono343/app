import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username: username,
        password: password,
        email: email,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
      } else {
        setMessage('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al registrar el usuario', error);
      setMessage('Error interno del servidor');
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <label>
        Nombre de Usuario:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Contraseña:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <label>
        Correo Electrónico:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <button onClick={handleRegister}>Registrar</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;

import axios from "axios";
import { jwtDecode as jwt_decode } from 'jwt-decode';

axios.defaults.baseURL = "http://localhost:5000";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem("token") || "",
            isLoggedIn: Boolean(localStorage.getItem("token")), // Set isLoggedIn based on the presence of the token
            user: {
                id: null,
                username: '',
                is_admin: '',
            },
        },
        actions: {
            registerUser: async (username, password) => {
                try {
                    const response = await axios.post("/register", { username, password, is_admin: 'admin' });
                    console.log('Registro exitoso. Respuesta del servidor:', response.data);
            
                    // Asegúrate de tener la propiedad correcta para el token
                    const token = response.data.access_token;
            
                    if (typeof token !== 'string' || token.length === 0) {
                        console.error('El token no es una cadena válida.');
                        return;
                    }
            
                    const decodedToken = jwt_decode(token);
            
                    await setStore({
                        token: token,
                        isLoggedIn: true,
                        user: {
                            id: decodedToken.sub.id,
                            username: decodedToken.sub.username,
                            is_admin: decodedToken.sub.is_admin || '',
                        },
                    });
            
                    localStorage.setItem("token", token);
            
                    // Asegúrate de que el estado se haya actualizado antes de acceder a getStore()
                    console.log('Valores del store después de registrar:', getStore().user);
                } catch (error) {
                    console.error('Error al registrar el usuario:', error);
                    if (error.response) {
                        console.log('Respuesta del servidor:', error.response.data);
                    }
                }
            },
                                    
            loginUser: async (username, password) => {
                try {
                    const response = await axios.post("/login", { username, password });
                    const { access_token } = response.data;

                    // Declare and define decodedToken
                    const decodedToken = jwt_decode(access_token);

                    console.log('Decoded Token:', decodedToken.sub);

                    if (decodedToken && decodedToken.sub && decodedToken.sub.username) {
                        // Asegúrate de que setStore sea asíncrono (retorne una promesa o sea async)
                        await setStore({
                            token: access_token,
                            isLoggedIn: true,
                            user: {
                                id: decodedToken.sub.id,
                                username: decodedToken.sub.username,
                                is_admin: decodedToken.sub.is_admin || '',
                            },
                        });

                        // Asegúrate de que el estado se haya actualizado antes de acceder a getStore()
                        console.log('Valores del store después de iniciar sesión:', getStore().user);

                        localStorage.setItem("token", access_token);

                        console.log('Login exitoso. Usuario:', decodedToken.sub.username, 'isAdmin:', decodedToken.sub.is_admin);
                    } else {
                        console.error('El token decodificado no contiene la información del usuario esperada.');
                    }
                } catch (error) {
                    console.error('Error de inicio de sesión:', error);
                }
            },

            validateToken: async () => {
                try {
                    // Retrieve the token from the store or localStorage
                    const token = getStore().store.token || localStorage.getItem("token");
            
                    // Verifica si el usuario está autenticado antes de intentar validar el token
                    if (!token || token === "") {
                        console.log('El usuario no está autenticado.');
                        return;
                    }
            
                    const response = await axios.get("/validate-token", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
            
                    console.log('Información del usuario desde validate-token:', response.data);
            
                    // Asegúrate de que setStore sea asíncrono (retorne una promesa o sea async)
                    await setStore({
                        isLoggedIn: true,
                        user: {
                            id: response.data.id || null,
                            username: response.data.username || '',
                            is_admin: response.data.is_admin || '',
                        },
                    });
            
                    // Asegúrate de que el estado se haya actualizado antes de acceder a getStore()
                    console.log('Valores del store después de validar el token:', getStore().user);
                } catch (error) {
                    console.error('Error al validar el token:', error);
                    console.log('Respuesta del servidor:', error.response);
            
                    // Manejar el error de autenticación (por ejemplo, redirigir a la página de inicio de sesión)
                    if (error.response && error.response.status === 401) {
                        // Redirige a la página de inicio de sesión
                        // window.location.href = '/login'; // Esto recargará toda la aplicación, asegúrate de que sea la solución deseada
                    }
                }
            },
            
            logout: async () => {
                try {
                    const token = localStorage.getItem("token");

                    // Verifica si el usuario está autenticado antes de intentar cerrar sesión
                    if (!token || token === "") {
                        console.log('El usuario no está autenticado.');
                        return;
                    }

                    // Realiza la solicitud para cerrar sesión en el servidor
                    const response = await axios.post("/logout", {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log('Logout exitoso:', response.data);

                    // Limpiar el estado y el almacenamiento local
                    setStore({
                        token: "",
                        isLoggedIn: false,
                        user: {
                            id: null,
                            username: '',
                            is_admin: '',
                        },
                    });

                    localStorage.removeItem("token");

                } catch (error) {
                    console.error('Error al intentar cerrar sesión:', error);
                    console.log('Respuesta del servidor:', error.response);
                }
            },
        },
    };
};

export default getState;

import axios from "axios";
import { jwtDecode as jwt_decode } from 'jwt-decode';

axios.defaults.baseURL = "http://localhost:5000";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem("token") || "",
            isLoggedIn: false,
            user: {
                id: null,
                username: '',
                is_admin: '',
            },
        },
        actions: {
            register: async (userData) => {
                try {
                    const response = await axios.post("/register", userData);
                    console.log(response.data);
                } catch (error) {
                    console.error("Error during registration:", error);
                }
            },

            login: async (userData) => {
                try {
                    const response = await axios.post("/login", userData);
                    const { access_token } = response.data || {};
            
                    if (access_token) {
                        const decodedToken = jwt_decode(access_token);
                        const { is_admin, username } = decodedToken.sub || {};
            
                        setStore({
                            token: access_token,
                            isLoggedIn: true,
                            user: {
                                id: decodedToken.jti,
                                username: username,
                                is_admin: is_admin
                            }
                        });
                        localStorage.setItem("token", access_token);
                        console.log("Estado después de establecer el token:", getStore());
            
                        await getActions().validate_token();
                    } else {
                        console.error("Token not found in the server response");
                    }
                } catch (error) {
                    console.error("Error during login:", error);
                }
            },

            updateLoginStatus: (isLoggedIn) => {
                setStore({ isLoggedIn });
            },
                        
            validate_token: async () => {
                try {
                    console.log("Starting token validation");
                    const { token } = getStore();
            
                    if (!token) {
                        console.error("No token in the state.");
                        return;
                    }
            
                    const response = await axios.get("/validate-token", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
            
                    console.log("Server response during token validation:", response.data);
            
                    // Actualiza la información del usuario en el estado
                    setStore({ user: response.data.username });
            
                } catch (error) {
                    console.error("Error validating the token:", error);
            
                    if (error.response && error.response.status === 401) {
                        console.error("Unauthorized. Perform logout actions here.");
                        getActions().logout();
                    }
                }
            },
                        
            logout: async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    setStore({ token: "", isLoggedIn: false, user: { id: null, username: '', is_admin: '' } });
                    localStorage.removeItem("token");
                } catch (error) {
                    console.error("Error during logout:", error);
                }

                
            },
        },
    };
};

export default getState;

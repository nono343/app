import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Crear el contexto
export const Context = React.createContext(null);

// Esta función envuelve tu componente y provee el contexto a través de un proveedor
const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    // Estado local para manejar el estado global de la aplicación
    const [state, setState] = useState(
      getState({
        getStore: () => state.store,
        getActions: () => state.actions,
        setStore: (updatedStore) =>
          setState({
            store: Object.assign(state.store, updatedStore),
            actions: { ...state.actions },
          }),
      })
    );

    useEffect(() => {
      const fetchData = async () => {
        // Verifica si ya estás autenticado para evitar un bucle infinito
        if (!state.store.isLoggedIn) {
          // Realiza acciones específicas al cargar la aplicación
          await state.actions.validateToken();
        }
      };
    
      // Llama a fetchData
      fetchData();
    
      // Este efecto se ejecuta solo una vez, es similar a componentDidMount en clases de componentes de clase
    }, [state.actions, state.store.isLoggedIn]); // Agrega state.actions y state.store.isLoggedIn al array de dependencias
            
    // El valor inicial del contexto no es nulo, es el estado actual de este componente
    return (
      <Context.Provider value={state}>
        {/* Pasar el componente envuelto con el proveedor de contexto */}
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };

  return StoreWrapper;
};

export default injectContext;

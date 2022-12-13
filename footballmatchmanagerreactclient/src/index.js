import 'bootstrap/dist/css/bootstrap.css';
import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './App';
import UserStore from "./addtionalcomponents/UserStore"

export const Context = createContext(null);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore()
    }}>
          <App/>
    </Context.Provider>
);



import 'bootstrap/dist/css/bootstrap.css';
import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

export const Context = createContext(null);

const MyProvider = (props) => {

    const serializedObject = sessionStorage.getItem('currentUser');
    const deserializedObject = serializedObject ? JSON.parse(serializedObject) : {
        notificonn: null,
        isAuth: false,
        isAdmin: false,
        userId: 0,
        userName: '',        
    };

    const[userContext, setUserContext] = useState(deserializedObject);

    useEffect(() => {
        console.log('UPDATE');
        console.log(userContext);
        sessionStorage.setItem('currentUser', JSON.stringify(userContext));
    }, [userContext])

    return(
        <Context.Provider value={{userContext, setUserContext}}>
            <App/>
        </Context.Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MyProvider />
);
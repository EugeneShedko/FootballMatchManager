import React, { createContext } from "react";
import {Routes, Route, Redirect} from 'react-router-dom'
import Content from "../pagescomponents/main/content";
import { AppRoutes } from "./Routes";

const AppRouter = () =>
{
    return(
        <Routes>
            {AppRoutes.map(({path, Component}) =>
               <Route key={path} path={path} element={Component} exact/>
            )}
        </Routes>
    );
}

export default AppRouter;
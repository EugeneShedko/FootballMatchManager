import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AppRoutes, AuthAppRoutes, AdminAppRoutes } from "./Routes";
import { Context } from "./../index";
import ContentContainer from "../Pages/MainPage/Content/ContentContainer";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {

    const {user, setUser} = useContext(Context);

    return (
        <div className="h-100 w-100">
            <Routes>
                {
                    AppRoutes.map(({ path, Component }) =>
                        <Route key={path} path={path} element={Component} exact />
                    )
                }
                {
                    user.isAuth && AuthAppRoutes.map(({ path, Component }) =>
                        <Route key={path} path={path} element={Component} exact />
                    )
                }
                {
                    user.isAdmin && AdminAppRoutes.map(({ path, Component }) =>
                        <Route key={path} path={path} element={Component} exact />
                    )
                                
                }
                <Route key="*" path="*" element={<ContentContainer />} exact/>
            </Routes>
            <ToastContainer />
        </div>
    );
});

export default AppRouter;
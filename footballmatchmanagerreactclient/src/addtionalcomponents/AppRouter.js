import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AppRoutes, AuthAppRoutes, AdminAppRoutes } from "./Routes";
import { Context } from "./../index";
import ContentContainer from "../Pages/MainPage/Content/ContentContainer";
import { observer } from "mobx-react-lite";
import Loginform from "../Pages/MainPage/LoginForm";
import FRegistrationform from "../Pages/MainPage/RegistrationForm";
import Matches from "../Pages/UserAccaunt/Games/ViewGames/Games";
import UserProfile from "../Pages/AccauntPage";
import Players from "../Pages/UserAccaunt/Players/ViewPlayers/Players";
import Teams from "../Pages/UserAccaunt/Teams/ViewTeams/Teams";
import Profile from "../Pages/UserAccaunt/Players/ViewPlayerCard/PlayerCard";
import Notifications from "../Pages/UserAccaunt/Notification/ViewNotification/Notifications";
import UserMatchesNavigator from "../Pages/UserAccaunt/Games/GamesNavigator";
import UserTeamsInfoCard from "../Pages/UserAccaunt/UserTeams/UserTeamsInfoCard";
import CreateMatch from "../Pages/UserAccaunt/Games/CreateGame";
import GameInfoCard from "../Pages/UserAccaunt/Games/ViewGameCard/GameInfoCard";
import EditGame from "../Pages/UserAccaunt/Games/ViewGameCard/EditGame";

const AppRouter = observer(() => {

    const { userContext } = useContext(Context);


    return (
        <div className="h-100 w-100">
            {/* Задать потом значение key для всех маршрутов*/}
            <Routes>
                <Route path="/" element={<ContentContainer />} />
                <Route path="/login" element={<Loginform />} />
                <Route path="/registration" element={<FRegistrationform />} />
                <Route path="/accaunt" element={<UserProfile />}>
                    <Route index element={<Matches />} />
                    <Route path="games" element={<Matches />}>
                        <Route path="creategame" element={<CreateMatch show={true} />} />
                    </Route>
                    <Route path="teams" element={<Teams />} />
                    <Route path="players" element={<Players />} />
                    {/* Нужно как-то передавать параметры */}
                    <Route path="gamecard/:id" element={<GameInfoCard />}>
                        <Route path="editgame" element={<EditGame show={true} />} />
                    </Route>
                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="usergames" element={<UserMatchesNavigator />} />
                    <Route path="userteams" element={<UserTeamsInfoCard />} />
                </Route>
                <Route path="*" element={<ContentContainer />} />
            </Routes>
            <ToastContainer />
        </div>
    );
});

export default AppRouter;
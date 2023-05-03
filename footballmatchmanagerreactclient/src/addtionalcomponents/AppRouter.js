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
import EditProfile from "../Pages/UserAccaunt/Players/ViewPlayerCard/EditProfile";
import CreateTeam from "../Pages/UserAccaunt/Teams/ViewTeams/CreateTeam";
import TeamInfoCard from "../Pages/UserAccaunt/Teams/ViewTeamCard/TeamInfoCard";
import UserMatchesCr from "../Pages/UserAccaunt/Games/GamesCreator";
import UserMatchesPr from "../Pages/UserAccaunt/Games/GamesParticipant";
import TeamGames from "../Pages/UserAccaunt/TeamGames/ViewTeamGames/TeamGames";
import TeamGameCard from "../Pages/UserAccaunt/TeamGames/ViewTeamGameInfoCard/TeamGamInfoCard";
import CreateTeamGame from "../Pages/UserAccaunt/TeamGames/CreateTeamGame";
import FinishTeamGame from "../Pages/UserAccaunt/TeamGames/ViewTeamGameInfoCard/FinishTeamGame";
import FinishGame from "../Pages/UserAccaunt/Games/ViewGameHistoryCard/FinishGame";

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
                    {/* Может делать так, чтобы всплывающие окна убирали, то, что позади тогда не будет проблемы с обновлением */}
                    <Route path="games" element={<Matches />}>
                        <Route path="creategame" element={<CreateMatch show={true} />} />
                    </Route>
                    <Route path="gamecard/:id" element={<GameInfoCard />}>
                        <Route path="editgame" element={<EditGame show={true} />} />
                    </Route>
                    {/* Добавить сюда компонент */}
                    <Route path="gamecard/:id/history" element = {<FinishGame />} />                    

                    <Route path="teamgames" element={<TeamGames req="all-team-games"/>}>
                        <Route path="creategame" element={<CreateMatch show={true} />} />
                    </Route>
                    <Route path="teamgamecard/:id" element={<TeamGameCard />}>
                        {/* Вот сюда можно попробовать добавить данный маршрут */}
                        {/*<Route path="editgame" element={<EditGame show={true} />} /> */}
                    </Route>
                    <Route path="teamgamecard/:id/history" element = {<FinishTeamGame />} />

                    <Route path="teamgamecreate" element={<CreateTeamGame show={true}/>} />

                    <Route path="players" element={<Players />} />
                    <Route path="playercard/:id" element={<Profile />}>
                        <Route path="editprofile" element={<EditProfile show={true} />} />
                    </Route>

                    <Route path="teams" element={<Teams />}>
                        <Route path="createteam" element={<CreateTeam show={true} />} />
                    </Route>
                    <Route path="teamcard/:id" element={<TeamInfoCard />} />

                    <Route path="notifications" element={<Notifications />} />
                    
                    <Route path="usergames/" element={<UserMatchesNavigator />}>
                        <Route index element={<UserMatchesCr />} />
                        <Route path="creategame" element={<CreateMatch show={true} />} />
                        <Route path="creatgames" element={<UserMatchesCr />}>
                            <Route path="creategame" element={<CreateMatch show={true} />} />
                        </Route>
                        <Route path="partgames" element={<UserMatchesPr />}>
                            <Route path="creategame" element={<CreateMatch show={true} />} />
                        </Route>
                        <Route path="teamgames" element={<TeamGames req="user-team-games"/>}>
                            {/*<Route path="creategame" element={<CreateMatch show={true} />} />*/}
                        </Route>
                    </Route>
                    <Route path="userteams" element={<UserTeamsInfoCard />} />
                </Route>
                <Route path="*" element={<ContentContainer />} />
            </Routes>
            <ToastContainer />
        </div>
    );
});

export default AppRouter;
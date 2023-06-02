import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
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
import UserMatchesPr from "../Pages/UserAccaunt/Games/GamesParticipant";
import TeamGames from "../Pages/UserAccaunt/TeamGames/ViewTeamGames/TeamGames";
import TeamGameCard from "../Pages/UserAccaunt/TeamGames/ViewTeamGameInfoCard/TeamGamInfoCard";
import CreateTeamGame from "../Pages/UserAccaunt/TeamGames/CreateTeamGame";
import FinishTeamGame from "../Pages/UserAccaunt/TeamGames/ViewTeamGameInfoCard/FinishTeamGame";
import FinishGame from "../Pages/UserAccaunt/Games/ViewGameHistoryCard/FinishGame";
import InviteCard from "../Pages/UserAccaunt/Games/ViewGameInviteCard/InviteCard";
import TeamGameInviteCard from "../Pages/UserAccaunt/TeamGames/ViewTeamGameInviteCard/TeamGameInviteCard";
import EditTeamGame from "../Pages/UserAccaunt/TeamGames/EditTeamGame";
import EditTeam from "../Pages/UserAccaunt/UserTeams/EditTeam";
import GameInfoCardAdmin from "../Pages/UserAccaunt/Games/ViewGameCard/GameInfoCardAdmin";
import TeamGameCardAdmin from "../Pages/UserAccaunt/TeamGames/ViewTeamGameInfoCard/TeamGameInfoCardAdmin";
import TeamInfoCardAdmin from "../Pages/UserAccaunt/Teams/ViewTeamCard/TeamInfoCradAdmin";
import PlayerCardAdmin from "../Pages/UserAccaunt/Players/ViewPlayerCard/PlayerCardAdmin";
import BlockPlayer from "../Pages/UserAccaunt/Players/ViewPlayerCard/BlockPlayer";
import ComplainWindow from "../Pages/UserAccaunt/Players/ViewPlayerCard/ComplainWindow";

const AppRouter = observer(() => {

    const { userContext } = useContext(Context);

    // -------------------------------------------------------------------------------------- //

    return (
        <div className="h-100 w-100">
            <Routes>
                <Route path="/" element={<ContentContainer />} />
                <Route path="/login" element={<Loginform />} />
                <Route path="/registration" element={<FRegistrationform />} />
                {userContext.isAuth ?
                    <Route path="/accaunt" element={<UserProfile />}>
                        <Route index element={<Matches />} />
                        <Route path="games" element={<Matches />}>
                            <Route path="creategame" element={<CreateMatch show={true} />} />
                        </Route>
                        <Route path="gamecard/:id" element={<GameInfoCard />}>
                            <Route path="editgame" element={<EditGame show={true} />} />
                        </Route>
                        <Route path="gamecard/:id/history" element={<FinishGame />} />
                        <Route path="gamecard/:id/gameinvite" element={<InviteCard />} />

                        <Route path="teamgames" element={<TeamGames mode="all" />}>
                            <Route path="creategame" element={<CreateMatch show={true} />} />
                        </Route>
                        <Route path="teamgamecard/:id" element={<TeamGameCard />} >
                            <Route path="editteamgame" element={<EditTeamGame show={true} />} />
                        </Route>
                        <Route path="teamgamecard/:id/history" element={<FinishTeamGame />} />
                        <Route path="teamgamecard/:id/teamgameinvite" element={<TeamGameInviteCard />} />

                        <Route path="teamgamecreate" element={<CreateTeamGame show={true} />} />

                        <Route path="players" element={<Players />} />
                        <Route path="playercard/:id" element={<Profile />}>
                            <Route path="editprofile" element={<EditProfile    show={true} />} />
                            <Route path="complain"    element={<ComplainWindow show={true}/>} />
                        </Route>
                        <Route path="playercard/:id/games" element={<UserMatchesNavigator />} >
                            <Route index element={<UserMatchesPr />} />
                            <Route path="partgames" element={<UserMatchesPr />} />
                            <Route path="teamgames" element={<TeamGames mode="user" />} />
                        </Route>

                        <Route path="teams" element={<Teams />}>
                            <Route path="createteam" element={<CreateTeam show={true} />} />
                        </Route>
                        <Route path="teamcard/:id" element={<TeamInfoCard />} >
                            <Route path="editteam" element={<EditTeam show={true} />} />
                        </Route>

                        <Route path="notifications" element={<Notifications />} />

                        <Route path="usergames/:id" element={<UserMatchesNavigator />}>
                            <Route index element={<UserMatchesPr />} />
                            <Route path="creategame" element={<CreateMatch show={true} />} />
                            <Route path="partgames" element={<UserMatchesPr />}>
                                <Route path="creategame" element={<CreateMatch show={true} />} />
                            </Route>
                            <Route path="teamgames" element={<TeamGames mode="user" />} />
                        </Route>
                        <Route path="userteams" element={<UserTeamsInfoCard />}>
                            <Route path="editteam" element={<EditTeam show={true} />} />
                        </Route>
                    </Route>
                    : null}
                {userContext.isAdmin ?
                    <Route path="/accaunt" element={<UserProfile />}>
                        <Route index element={<Matches />} />
                        <Route path="games" element={<Matches />} />
                        <Route path="gamecard/:id" element={<GameInfoCardAdmin />} />

                        <Route path="teamgames" element={<TeamGames req="all-team-games" />} />
                        <Route path="teamgamecard/:id" element={<TeamGameCardAdmin />} />

                        <Route path="teams" element={<Teams />} />
                        <Route path="teamcard/:id" element={<TeamInfoCardAdmin />} />

                        <Route path="players" element={<Players />} />

                        <Route path="playercard/:id" element={<PlayerCardAdmin />} >
                            <Route path="blockplayer" element={<BlockPlayer show={true} />} />
                        </Route>
                        <Route path="playercard/:id/games" element={<UserMatchesNavigator />} >
                            <Route index element={<UserMatchesPr />} />
                            <Route path="partgames" element={<UserMatchesPr />} />
                            <Route path="teamgames" element={<TeamGames mode="user" />} />
                        </Route>

                        <Route path="notifications" element={<Notifications />} />

                    </Route>

                    : null}
                <Route path="*" element={<ContentContainer />} />
            </Routes>
            <ToastContainer />
        </div>
    );
});

export default AppRouter;
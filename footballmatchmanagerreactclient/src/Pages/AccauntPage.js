import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MAIN_ROUTE } from "../Utilts/Consts";
import { Context } from "../index";

import Matches from "./UserAccaunt/Games/ViewGames/Games";
import Players from "./UserAccaunt/Players/ViewPlayers/Players";
import Profile from "./UserAccaunt/Players/ViewPlayerCard/PlayerCard";
import UserMatchesNavigator from "./UserAccaunt/Games/GamesNavigator";
import Notifications from "./UserAccaunt/Notification/ViewNotification/Notifications";
import Teams from "./UserAccaunt/Teams/ViewTeams/Teams"

import "./../css/userprofile.css"
import UserTeamsInfoCard from './UserAccaunt/UserTeams/UserTeamsInfoCard';

export default function UserProfile() {

    const { user } = useContext(Context);

    const navigate = useNavigate();

    const [mathesState, setMatchesState] = useState({
        eventKey: <Matches setContState={wrapSetMatchesState} isPanel={true} />
    });

    const [playersState, setPlayerState] = useState({
        eventKey: <Players setContState={wrapSetPlayersState} isPanel={true} />
    });

    const [userMatchesNav, setUserMatchNav] = useState({
        eventKey: <UserMatchesNavigator />
    });

    const [nnotif, setNotif] = useState({
        eventKey: <Notifications />
    });

    const [teamsState, setTeamsState] = useState({
        eventKey: <Teams setContState={wrapSetTeamsState} />
    });

    // ------------------------------------------------------------- //

    function wrapSetTeamsState(comp) {
        setTeamsState({ eventKey: comp });
    }

    // ------------------------------------------------------------- //

    function wrapSetMatchesState(comp) {
        setMatchesState({ eventKey: comp });
    }

    // ------------------------------------------------------------- //

    function wrapSetPlayersState(comp) {
        setPlayerState({ eventKey: comp });
    }

    // ------------------------------------------------------------- //

    function setMatchesKey() {
        if (mathesState.eventKey !== "matches") {
            setMatchesState({
                eventKey: <Matches setContState={wrapSetMatchesState} />
            })
        }
    }

    // ------------------------------------------------------------- //

    function setTeamsKey() {
        if (teamsState.eventKey !== "teams") {
            setTeamsState({
                eventKey: <Teams setContState={wrapSetTeamsState} />
            })
        }
    }

    // ------------------------------------------------------------- //

    function setPlayerKey() {
        if (playersState.eventKey !== "players") {
            setPlayerState({
                eventKey: <Players setContState={wrapSetPlayersState} />
            })
        }
    }

    // ------------------------------------------------------------- //

    function setNavKey()
    {
        setUserMatchNav({
            eventKey: <UserMatchesNavigator />
        })    
    }

    // ------------------------------------------------------------- //

    function setNotifKey()
    {
        setNotif({
            eventKey: <Notifications />
        })
    }

    // ------------------------------------------------------------- //

    return (
        <div id="userprofile-container" className='row m-0 h-100'>
            <Tab.Container defaultActiveKey="matches">
                <Row className="m-0 p-0">
                    <Col sm={2} className="p-0">
                        <Nav className="flex-column upnav-container">
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="matches" onClick={setMatchesKey}>Матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="players" onClick={setPlayerKey}>Игроки</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="teams" onClick={setTeamsKey}>Команды</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="profile">Профиль</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="notification" onClick={setNotifKey}>Уведомления</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="usermatches" onClick={setNavKey}>Мои матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="userteam" onClick={setNavKey}>Моя команда</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="exit" onClick={() => { user.setAuth(false); navigate(MAIN_ROUTE); }}>Выход</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10} className="p-0">
                        <Tab.Content className="h-100">
                            <Tab.Pane className="h-100" eventKey="matches">
                                {mathesState.eventKey}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="players">
                                {playersState.eventKey}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="teams">
                                {teamsState.eventKey}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="profile">
                                <Profile apUserId={user.getUserId} />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="usermatches">
                                {userMatchesNav.eventKey}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="userteam">
                                <UserTeamsInfoCard />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="notification">
                                {nnotif.eventKey}
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
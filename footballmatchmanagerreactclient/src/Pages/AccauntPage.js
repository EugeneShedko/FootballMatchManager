import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { TO_GAMES, TO_MAIN, TO_NOTIFICATION, TO_PLAYERS, TO_PROFILE, TO_TEAMS, TO_USER_GAMES, TO_USER_TEAMS } from "../Utilts/Consts";
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

    function setNavKey() {
        setUserMatchNav({
            eventKey: <UserMatchesNavigator />
        })
    }

    // ------------------------------------------------------------- //

    function setNotifKey() {
        setNotif({
            eventKey: <Notifications />
        })
    }

    // ------------------------------------------------------------- //

    /* Попробовать TOLINK? */

    return (
        <div id="userprofile-container" className='row m-0 h-100'>
            <Tab.Container defaultActiveKey="matches">
                <Row className="m-0 p-0">
                    <Col sm={2} className="p-0">
                        <Nav className="flex-column upnav-container">
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_GAMES, {state:{refresh:true}})}>Матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_PLAYERS, {state:{refresh:true}})}>Игроки</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_TEAMS)}>Команды</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_PROFILE)} >Профиль</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_NOTIFICATION)}>Уведомления</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_USER_GAMES)}>Мои матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_USER_TEAMS)}>Моя команда</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="exit" onClick={() => { user.setAuth(false); navigate(TO_MAIN); }}>Выход</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10} className="p-0">
                        <Outlet />
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
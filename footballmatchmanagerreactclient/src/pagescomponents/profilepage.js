import "./../css/userprofile.css"
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import Tournaments from "./userprofile/tournaments";
import Players from "./userprofile/players";
import { useNavigate } from "react-router-dom";
import Profile from "./userprofile/profile";
import UserMatchesNavigator from "./userprofile/usermatches/usermatchesnavigator";
import Matches from "./userprofile/matches";
import UserTournamentsNavigator from "./userprofile/usertournaments/usertournamentsnavigator";
import { useContext, useState } from "react";
import { MAIN_ROUTE } from "../Utilts/Consts";
import { Context } from "./../index";
import Teams from "./userprofile/Teams";
import TeamInfoPage from "./TeamInfoPage";

export default function UserProfile() {

    const { user } = useContext(Context);

    const navigate = useNavigate();

    const [mathesState, setMatchesState] = useState({
        eventKey: <Matches setContState={wrapSetMatchesState} isPanel={true} />
    });

    const [tournamenstState, setTournamentState] = useState({
        eventKey: <Tournaments setContState={wrapSetTournamentsState} />
    });

    const [playersState, setPlayerState] = useState({
        eventKey: <Players setContState={wrapSetPlayersState} isPanel={true} />
    });

    const [teamsState, setTeamsState] = useState({
        eventKey: <Teams setContState={wrapSetTeamsState} />
    });

    function wrapSetTeamsState(comp) {
        setTeamsState({ eventKey: comp });
    }

    function wrapSetMatchesState(comp) {
        setMatchesState({ eventKey: comp });
    }

    function wrapSetTournamentsState(comp) {
        setTournamentState({ eventKey: comp });
    }

    function wrapSetPlayersState(comp) {
        setPlayerState({ eventKey: comp });
    }

    function setMatchesKey() {
        if (mathesState.eventKey !== "matches") {
            setMatchesState({
                eventKey: <Matches setContState={wrapSetMatchesState} />
            })
        }
    }

    function setTeamsKey() {
        if (teamsState.eventKey !== "teams") {
            setTeamsState({
                eventKey: <Teams setContState={wrapSetTeamsState} />
            })
        }
    }

    function setTournamentKey() {
        if (tournamenstState.eventKey !== "tournaments") {
            setTournamentState({
                eventKey: <Tournaments setContState={wrapSetTournamentsState} />
            })
        }
    }

    function setPlayerKey() {
        if (playersState.eventKey !== "players") {
            setPlayerState({
                eventKey: <Players setContState={wrapSetPlayersState} />
            })
        }
    }

    return (
        <div id="userprofile-container" className='row m-0 h-100'>
            <Tab.Container defaultActiveKey="matches">
                <Row className="m-0 p-0">
                    <Col sm={2} className="p-0">
                        <Nav className="flex-column upnav-container">
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="matches" onClick={setMatchesKey}>Матчи</Nav.Link>
                            </Nav.Item>
                            {/*
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="tournaments" onClick={setTournamentKey}>Турниры</Nav.Link>
                            </Nav.Item>
                            */}
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
                                <Nav.Link className="upnav-item-link" eventKey="usermatches">Мои матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="userteam">Моя команда</Nav.Link>
                            </Nav.Item>
                            {/*
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="usertournaments">Мои турниры</Nav.Link>
                            </Nav.Item>
                            */}
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
                            {/*
                            <Tab.Pane className="h-100" eventKey="tournaments">
                                {tournamenstState.eventKey}
                            </Tab.Pane>                            
                            */}
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
                                <UserMatchesNavigator />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="userteam">
                                {/*Скорее всего будет проблема с обновлением страницы, если пользователь покинет или 
                                присоединиться к матчу
                                <TeamInfoPage />
                                */}
                            </Tab.Pane>                            
                            {/*
                            <Tab.Pane className="h-100" eventKey="usertournaments">
                                <UserTournamentsNavigator />
                            </Tab.Pane>
                            */}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
import "./../css/userprofile.css"
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import Tournaments from "./userprofile/tournaments";
import Players from "./userprofile/players";
import { useNavigate } from "react-router-dom";
import Profile from "./userprofile/profile";
import UserMatchesNavigator from "./userprofile/usermatches/usermatchesnavigator";
import Matches from "./userprofile/matches";
import UserTournamentsNavigator from "./userprofile/usertournaments/usertournamentsnavigator";
import { useState } from "react";

export default function UserProfile() {

    const [mathesState, setMatchesState] = useState({
        eventKey: <Matches setContState={wrapSetMatchesState} />
    });

    const [tournamenstState, setTournamentState] = useState({
        eventKey: <Tournaments setContState={wrapSetTournamentsState} />
    });

    function wrapSetMatchesState(comp) {
        setMatchesState({ eventKey: comp });
    }

    function wrapSetTournamentsState(comp) {
        setTournamentState({ eventKey: comp });
    }

    function setMatchesKey() {
        if (mathesState.eventKey !== "matches") {
            setMatchesState({
                eventKey: <Matches setContState={wrapSetMatchesState} />
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
                                <Nav.Link className="upnav-item-link" eventKey="tournaments" onClick={setTournamentKey}>Турниры</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="players">Игроки</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="profile">Профиль</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="usermatches">Мои матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="usertournaments">Мои турниры</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="exit">Выход</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10} className="p-0">
                        <Tab.Content className="h-100">
                            <Tab.Pane className="h-100" eventKey="matches">
                                {mathesState.eventKey}
                                {/*
                                <Matches contState    = {mathesState} 
                                         setContState = {setMatchesState}
                                 />        
                                 */}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="tournaments">
                                {tournamenstState.eventKey}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="players">
                                <Players />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="profile">
                                <Profile />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="usermatches">
                                <UserMatchesNavigator />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="usertournaments">
                                <UserTournamentsNavigator />
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="currentmatch">
                                <h1>Hello, current match!</h1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="exit">
                                {
                                    /*
                                      Проблема не работает
                                      Прочитать про useEffect
                                      navigate(MAIN_ROUTE)
                                    */
                                }
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
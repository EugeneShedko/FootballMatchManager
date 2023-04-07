
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTE } from "../Utilts/Consts";
import { useContext, useState } from "react";
import {Context} from "../index"
import AdminMatches from "./Matches/AdminGames";
import AdminPlayers from "./Players/AdminPlayers";

import "./../css/PlayerCard.css";

export default function AdminProfile() {

    const {user}   = useContext(Context);
    const navigate = useNavigate();

    const [mathesState, setMatchesState] = useState({
        eventKey: <AdminMatches setContState={wrapSetMatchesState} />
    });

    const [playersState, setPlayersState] = useState({
        eventKey: <AdminPlayers setContState={wrapSetPlayersState} />
    });

    // ----------------------------------------------------------------------- //

    function wrapSetMatchesState(comp) {
        setMatchesState({ eventKey: comp });
    }

    // ----------------------------------------------------------------------- //

    function wrapSetPlayersState(comp) {
        setPlayersState({ eventKey: comp });
    }

    // ----------------------------------------------------------------------- //

    function setMatchesKey() {
        if (mathesState.eventKey !== "matches") {
            setMatchesState({
                eventKey: <AdminMatches setContState={wrapSetMatchesState} />
            })
        }
    }

    // ----------------------------------------------------------------------- //

    function setPlayersKey() {
        if (playersState.eventKey !== "users") {
            setPlayersState({
                eventKey: <AdminPlayers setContState={wrapSetPlayersState} />
            })
        }
    }

    // ----------------------------------------------------------------------- //

    return (
        <div id="userprofile-container" className='row m-0 h-100'>
            <Tab.Container defaultActiveKey="matches">
                <Row className="m-0 p-0">
                    <Col sm={2} className="p-0">
                        <Nav className="flex-column upnav-container">
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="matches" onClick={setMatchesKey} >Матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link id="users" className="upnav-item-link" eventKey="users" onClick={setPlayersKey} >Пользователи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="exit" onClick={() => {user.setAdmin(false); navigate(MAIN_ROUTE);}}>Выход</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10} className="p-0">
                        <Tab.Content className="h-100">
                            <Tab.Pane className="h-100" eventKey="matches">
                                {mathesState.eventKey}
                            </Tab.Pane>
                            <Tab.Pane className="h-100" eventKey="users">
                                {playersState.eventKey}
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
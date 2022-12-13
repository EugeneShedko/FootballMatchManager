import { useState } from "react";
import { Tab, Nav, Row } from "react-bootstrap";
import Tournaments from "../tournaments";
import "./../../../css/usertournamentsnavigator.css"

export default function UserTournamentsNavigator() {

    const [partTournamentsState, setPartTournamentsState] = useState({
        eventKey: <Tournaments setContState={wrapSetPartTournamentsState} />
    });

    const [createTournamentsState, setCreateTournamentsState] = useState({
        eventKey: <Tournaments setContState={wrapSetCreateTournamentsState} />
    });

    function wrapSetPartTournamentsState(comp) {
        setPartTournamentsState({ eventKey: comp });
    }

    function wrapSetCreateTournamentsState(comp) {
        setCreateTournamentsState({ eventKey: comp });
    }


    function setPartTournamentsKey() {
        if (partTournamentsState.eventKey !== "participant") {
            setPartTournamentsState({
                eventKey: <Tournaments setContState={wrapSetPartTournamentsState} />
            })
        }
    }

    function setCreateTournamentsKey() {
        if (createTournamentsState.eventKey !== "creator") {
            setCreateTournamentsState({
                eventKey: <Tournaments setContState={wrapSetCreateTournamentsState} />
            })
        }
    }


    return (
        <Tab.Container defaultActiveKey="participant">
            <Row className="utnav-main-container">
                <Nav className="utnav-container">
                    <Nav.Item className="utnav-item">
                        <Nav.Link className="utnav-item-link" eventKey="participant" onClick={setPartTournamentsKey}>
                            Участник
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="utnav-item">
                        <Nav.Link className="utnav-item-link" eventKey="creator" onClick={setCreateTournamentsKey}>
                            Организатор
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            <Row className="ut-content-container">
                <Tab.Content className="h-100 p-0">
                    <Tab.Pane className="h-100" eventKey="participant">
                        {partTournamentsState.eventKey}
                    </Tab.Pane>
                    <Tab.Pane className="h-100" eventKey="creator">
                        {createTournamentsState.eventKey}
                    </Tab.Pane>
                </Tab.Content>
            </Row>
        </Tab.Container>
    );
} 
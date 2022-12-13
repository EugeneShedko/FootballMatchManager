import { useState } from "react";
import { Tab, Nav, Row } from "react-bootstrap";
import Matches from "../matches";
import "./../../../css/usermatchesnavigator.css"
import UserMatches from "./usermatches";

export default function UserMatchesNavigator() {

    const [partMatchesState, setPartMatchesState] = useState({
        eventKey: <Matches setContState={wrapSetPartMatchesState} />
    });

    const [createMatchesState, setCreateMatchesState] = useState({
        eventKey: <Matches setContState={wrapSetCreateMatchesState} />
    });

    function wrapSetPartMatchesState(comp) {
        setPartMatchesState({ eventKey: comp });
    }

    function wrapSetCreateMatchesState(comp) {
        setCreateMatchesState({ eventKey: comp });
    }


    function setPartMatchesKey() {
        if (partMatchesState.eventKey !== "participant") {
            setPartMatchesState({
                eventKey: <Matches setContState={wrapSetPartMatchesState} />
            })
        }
    }

    function setCreateMatchesKey() {
        if (createMatchesState.eventKey !== "creator") {
            setCreateMatchesState({
                eventKey: <Matches setContState={wrapSetCreateMatchesState} />
            })
        }
    }

    return (
        <Tab.Container defaultActiveKey="participant">
            <Row className="umnav-main-container">
                <Nav className="umnav-container">
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" eventKey="participant" onClick={setPartMatchesKey}>
                            Участник
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" eventKey="creator" onClick={setCreateMatchesKey}>
                            Организатор
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            <Row className="um-content-container">
                <Tab.Content className="h-100 p-0">
                    <Tab.Pane className="h-100" eventKey="participant">
                        {partMatchesState.eventKey}
                    </Tab.Pane>
                    <Tab.Pane className="h-100" eventKey="creator">
                        {createMatchesState.eventKey}
                    </Tab.Pane>
                </Tab.Content>
            </Row>
        </Tab.Container>
    );
} 
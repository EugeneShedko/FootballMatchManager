import { useEffect, useState } from "react";
import { Tab, Nav, Row } from "react-bootstrap";
import Matches from "../Matches";
import "./../../../css/usermatchesnavigator.css"
import UserMatchesCr from "./UserMatchesCreator";
import UserMatchesPr from "./UserMatchesParticipant";

export default function UserMatchesNavigator(props) {

    const [partMatchesState, setPartMatchesState] = useState({
        eventKey: <UserMatchesPr setContState={wrapSetPartMatchesState} />
    });

    const [createMatchesState, setCreateMatchesState] = useState({
        eventKey: <UserMatchesCr setContState={wrapSetCreateMatchesState} />
    });

    useEffect(() => {
        setPartMatchesKey();
        setCreateMatchesKey();
    }, [props])

    function wrapSetPartMatchesState(comp) {
        setPartMatchesState({ eventKey: comp });
    }

    function wrapSetCreateMatchesState(comp) {
        setCreateMatchesState({ eventKey: comp });
    }


    function setPartMatchesKey() {
        if (partMatchesState.eventKey !== "participant") {
            setPartMatchesState({
                eventKey: <UserMatchesPr setContState={wrapSetPartMatchesState} />
            })
        }
    }

    function setCreateMatchesKey() {
        if (createMatchesState.eventKey !== "creator") {
            setCreateMatchesState({
                eventKey: <UserMatchesCr setContState={wrapSetCreateMatchesState} />
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
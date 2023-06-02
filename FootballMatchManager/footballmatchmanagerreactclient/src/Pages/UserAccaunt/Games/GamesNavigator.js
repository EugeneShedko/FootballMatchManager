import { Tab, Nav, Row } from "react-bootstrap";
import "./../../../css/usermatchesnavigator.css"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TO_USER_GAMES_PARTICIPANT, TO_USER_TEAM_GAMES } from "../../../Utilts/Consts";
import { useState } from "react";

export default function UserMatchesNavigator() {

    const navigate = useNavigate();
    const location = useLocation();
    const [initialPath, setInitialPath] = useState(location.pathname.replace(TO_USER_GAMES_PARTICIPANT, "").replace(TO_USER_TEAM_GAMES, ""));

    // --------------------------------------------------------------------------- //

    return (
        <Tab.Container defaultActiveKey="participant">
            <Row className="umnav-main-container">
                <Nav className="umnav-container">
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" onClick={() => navigate(initialPath + TO_USER_GAMES_PARTICIPANT)}>
                            Индивидуальные матчи
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" onClick={() => navigate(initialPath + TO_USER_TEAM_GAMES)}>
                            Командные матчи
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            <Row className="um-content-container">
                <Outlet />
            </Row>
        </Tab.Container>
    );
} 
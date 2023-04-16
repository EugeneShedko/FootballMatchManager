import { useEffect, useState } from "react";
import { Tab, Nav, Row } from "react-bootstrap";
import Matches from "./ViewGames/Games";
import "./../../../css/usermatchesnavigator.css"
import UserMatchesCr from "./GamesCreator";
import UserMatchesPr from "./GamesParticipant";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { TO_USER_GAMES_CREATOR, TO_USER_GAMES_PARTICIPANT } from "../../../Utilts/Consts";

export default function UserMatchesNavigator() {

    const navigate = useNavigate();

    // --------------------------------------------------------------------------- //

    return (
        <Tab.Container defaultActiveKey="participant">
            <Row className="umnav-main-container">
                <Nav className="umnav-container">
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" onClick={() => navigate(TO_USER_GAMES_PARTICIPANT)}>
                            Участник
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" onClick={() => navigate(TO_USER_GAMES_CREATOR)}>
                            Организатор
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
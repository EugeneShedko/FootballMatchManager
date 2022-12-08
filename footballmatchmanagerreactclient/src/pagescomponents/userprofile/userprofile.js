import "./../../css/userprofile.css"
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import Matches from "./matches";
import Tournaments from "./tournaments";
import Players from "./players";
import Content from "./../main/content"
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTE } from "../../Utilts/Consts";

export default function UserProfile() {

    const navigate = useNavigate();

    return (
        <div id="userprofile-container" className='row m-0 h-100'>
            <Tab.Container defaultActiveKey="matches">
                <Row className="m-0 p-0">
                    <Col sm={3} className="p-0">
                        <Nav className="flex-column nav-container">
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="matches">Матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="tournaments">Турниры</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="players">Игроки</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="profile">Профиль</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="usermatches">Мои матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="usertournaments">Мои турниры</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item">
                                <Nav.Link className="nav-item-link" eventKey="exit">Выход</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    {/*Возможно проблемы потом с маршрутами будут*/}
                    <Col sm={9} className="p-0">
                        <Tab.Content>
                            <Tab.Pane eventKey="matches">
                                <Matches />                          
                            </Tab.Pane>
                            <Tab.Pane eventKey="tournaments">
                                <Tournaments />
                            </Tab.Pane>
                            <Tab.Pane eventKey="players">
                                <Players/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="profile">
                                <h1>Профиль</h1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="usermatches">
                                <h1>Матчи пользователя</h1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="usertournaments">
                                <h1>Турниры пользователя</h1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="exit">
                                {/*Проблема не работает*/}
                                {/*Прочитать про useEffect*/}
                                {navigate(MAIN_ROUTE)}
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
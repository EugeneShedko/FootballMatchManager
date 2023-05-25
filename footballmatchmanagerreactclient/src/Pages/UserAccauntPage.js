import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { useNavigate, Outlet } from "react-router-dom";
import { TO_GAMES, TO_MAIN, TO_NOTIFICATION, TO_PLAYERS, TO_PLAYER_CARD, TO_TEAMS, TO_TEAM_GAMES, TO_USER_GAMES, TO_USER_TEAMS } from "../Utilts/Consts";
import { Context } from "../index";
import { useContext} from "react";

export default function UserAccauntPage()
{
    const { userContext, setUserContext } = useContext(Context);
    const navigate = useNavigate();

    // ------------------------------------------------------------------------------- //

    return ( 
        <div id="userprofile-container" className='row m-0 h-100'>
            <Tab.Container defaultActiveKey="matches">
                <Row className="m-0 p-0">
                    <Col sm={2} className="p-0">
                        <Nav className="flex-column upnav-container">
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_GAMES, { state: { refresh: true } })}>Персональные матч</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_TEAM_GAMES, { state: { refresh: true } })}>Командные матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_PLAYERS, { state: { refresh: true } })}>Игроки</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_TEAMS)}>Команды</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_PLAYER_CARD + '/' + userContext.userId)} >Профиль</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_NOTIFICATION)}>
                                    <div className="row m-0 p-0">
                                        <div className="col-8 m-0 p-0">Уведомления</div>
                                        {userContext.notifiCount > 0 ?
                                            userContext.notifiCount > 99 ? '99+' :
                                                <div className="col-4 notifi-count">{userContext.notifiCount}</div>
                                            : null}
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_USER_GAMES + '/' + userContext.userId)}>Мои матчи</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_USER_TEAMS)}>Моя команда </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="upnav-item">
                                <Nav.Link className="upnav-item-link" eventKey="exit" onClick={() => {
                                    setUserContext(prevContext => ({
                                        ...prevContext, isAuth: false
                                    }));
                                    navigate(TO_MAIN);
                                }}>Выход</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10} className="p-0">
                        <Outlet />
                    </Col>
                </Row>
            </Tab.Container>
        </div >
    )
}
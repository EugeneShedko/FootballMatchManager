import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { useNavigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { TO_GAMES, TO_MAIN, TO_NOTIFICATION, TO_PLAYERS, TO_PLAYER_CARD, TO_TEAMS, TO_TEAM_GAMES, TO_USER_GAMES, TO_USER_TEAMS } from "../Utilts/Consts";
import { Context } from "../index";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";
import axios from "axios";

import "./../css/userprofile.css";

export default function UserProfile() {

    const { userContext, setUserContext } = useContext(Context);
    const navigate = useNavigate();
    const connection = useRef(null);
    const [notifiCount, setNotifiCount] = useState(0);

    // --------------------------------------------------------- //

    useEffect(() => {

        notifiFunction();

        return (() => {

            if (connection.current) {
                connection.current.stop();
            }
        })
    }, [])

    const notifiFunction = async () => {

        const conn = await connectGame();
        const count = await getNotReadNotifiCount();

        setUserContext({
            ...userContext, notificonn: conn, notifiCount: count,
        });
    }

    // --------------------------------------------------------- //

    const getNotReadNotifiCount = async () => {

        let count = 0;

        await axios.get('http://localhost:5004/api/notification/user-notif-count', { withCredentials: true })
            .then((response) => {
                count = response.data;
            })
            .catch(userError => {
                if (userError.response) {
                    console.log('ACCAUNTPAGE NOTIFI COUNT');
                    console.log(userError);
                }
            });
        return count;
    }

    // --------------------------------------------------------- //

    const connectGame = async () => {
        const connect = new HubConnectionBuilder().withUrl("http://localhost:5004/notification")
            .build();


        connect.on("displayNotifi", displayNotifMess);
        connect.on("displayNotifiError", displayNotifiError);

        connect.onclose(() => {
            connectGame();
        })

        connect.start();

        connection.current = connect;

        return connect;

    }

    // --------------- Отображение успешного уведолмение пользователя -------------------- //

    const displayNotifMess = async (message) => {

        toast.success(message,
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnFocusLoss: false
            });

        let count = await getNotReadNotifiCount();
        setUserContext(prevContext => ({
            ...prevContext, notifiCount: count, notificonn: connection.current
        }));
    }

    // --------------- Отображение не успешного уведомления пользователя -------------------- //

    const displayNotifiError = async (message) => {

        toast.error(message,
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnFocusLoss: false
            });

        let count = await getNotReadNotifiCount();
        console.log('COUNT');
        console.log(count);
        setUserContext(prevContext => ({
            ...prevContext, notifiCount: count, notificonn: connection.current
        }));
    }

    // --------------------------------------------------------- //

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
                                <Nav.Link className="upnav-item-link" onClick={() => navigate(TO_USER_GAMES)}>Мои матчи</Nav.Link>
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
    );
}
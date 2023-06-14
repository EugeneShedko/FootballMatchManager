import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../../index";
import { useContext, useEffect, useState } from "react";
import ReadBlock from "./ReadBlock";
import RequestBlock from "./RequestBlock";

import "./../../../../css/Notification/NotificationBlock.css";

export default function NotificationBlock(props) {

    const { userContext, setUserContext } = useContext(Context);

    // ---------------------------------------------------------------------------------------- //

    function dismissRequestGame() {
        /* Плохо сделано, потому что выходит как бы некое разделение */
        /* Может хреново отработать */
        /* Пока что оставлю так*/
        
        var conn = userContext.notificonn;
        conn.invoke("DismissReqGame", props.notify.pkId);

        readNotifi();
    }

    // ---------------------------------------------------------------------------------------- //

    function acceptRequestGame() {
        /* Плохо сделано, потому что выходит как бы некое разделение */
        /* Может хреново отработать */
        /* Пока что оставлю так*/

        const data = new FormData();
        data.append("gameId", props.notify.entityId);
        data.append("userId", props.notify.fkSenderId);

        axios.post('http://localhost:5004/api/profile/add-to-game', data, { withCredentials: true })
            .then((response) => {
                var conn = userContext.notificonn;
                conn.invoke("AcceptReqGame", props.notify.pkId);
                readNotifi();
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.data.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                    readNotifi();    
                }
            });
    }

    // ---------------------------------------------------------------------------------------- //

    function readNotifi() {

        var data = new FormData();
        data.append("notifId", props.notify.pkId);

        axios.put('http://localhost:5004/api/notification/read-notifi', data, { withCredentials: true })
            .then((response) => {
                /* Плохо, что возвращается весь список уведомлений пользователя */
                props.setNotifiList(response.data.list);

                setUserContext(prevContext => ({
                    ...prevContext, notifiCount: response.data.count
                }));
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.data.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }

    // ---------------------------------------------------------------------------------------- //

    function acceptRequestTeam()
    {
        const data = new FormData();
        data.append("teamId", props.notify.entityId);
        data.append("userId", props.notify.fkSenderId);

        axios.post('http://localhost:5004/api/team/add-to-team', data, { withCredentials: true })
        .then((response) => {
            var conn = userContext.notificonn;
            conn.invoke("AcceptReqTeam", props.notify.pkId);
            readNotifi();
        })
        .catch(userError => {
            if (userError.response) {
                toast.error(userError.response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            }
        });

    }

    // ---------------------------------------------------------------------------------------- //

    function acceptRequestTeamGame()
    {
        const data = new FormData();
        data.append("teamGameId", props.notify.entityId);
        data.append("userId", props.notify.fkSenderId);

        axios.post('http://localhost:5004/api/teamgame/add-to-teamgame', data, { withCredentials: true })
        .then((response) => {
            var conn = userContext.notificonn;
            conn.invoke("AcceptReqTeamGame", props.notify.pkId);
            readNotifi();
        })
        .catch(userError => {
            if (userError.response) {
                toast.error(userError.response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            }
        });
    }

    // ---------------------------------------------------------------------------------------- //

    function dismissRequestTeam()
    {
        var conn = userContext.notificonn;
        conn.invoke("DismissReqTeam", props.notify.pkId);
        readNotifi();
    }

    // ---------------------------------------------------------------------------------------- /

    function dismissRequestTeamGame()
    {
        var conn = userContext.notificonn;
        conn.invoke("DismissReqTeamGame", props.notify.pkId);
        readNotifi();
    }

    // ---------------------------------------------------------------------------------------- //

    function acceptInviteTeam()
    {
        /* Здесь нужно подумать, каккого пользователя добавлять */
        const data = new FormData();
        data.append("teamId", props.notify.entityId);
        data.append("userId", props.notify.fkRecipient);

        axios.post('http://localhost:5004/api/team/add-to-team', data, { withCredentials: true })
        .then((response) => {
            var conn = userContext.notificonn;
            conn.invoke("AcceptInvitationToTeam", props.notify.pkId);
            readNotifi();
        })
        .catch(userError => {
            if (userError.response) {
                toast.error(userError.response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            }
        });

    }

    // ---------------------------------------------------------------------------------------- //
    
    function dismissInviteTeam()
    {
        var conn = userContext.notificonn;
        conn.invoke("DismissInvitationToTeam", props.notify.pkId);
        readNotifi();
    }    

    // ---------------------------------------------------------------------------------------- //

    function acceptInviteGame()
    {
        const data = new FormData();
        data.append("gameId", props.notify.entityId);
        data.append("userId", props.notify.fkRecipient);

        axios.post('http://localhost:5004/api/profile/add-to-game', data, { withCredentials: true })
            .then((response) => {
                var conn = userContext.notificonn;
                conn.invoke("AcceptInvitationToGame", props.notify.pkId);
                readNotifi();
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.data.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                    readNotifi();    
                }
            });
    }

    // ---------------------------------------------------------------------------------------- //

    function dismissInviteGame()
    {
        var conn = userContext.notificonn;
        conn.invoke("DismissInvitationToGame", props.notify.pkId);
        readNotifi();
    }

    // ------------------------- Приглшание на участие в командном матче ---------------------- //

    function acceptInviteTeamGame()
    {

        const data = new FormData();
        data.append("teamGameId", props.notify.entityId);
        data.append("userId", props.notify.fkRecipient);

        axios.post('http://localhost:5004/api/teamgame/add-to-teamgame', data, { withCredentials: true })
        .then((response) => {
            var conn = userContext.notificonn;
            conn.invoke("AcceptInvitationToTeamGame", props.notify.pkId);
            /* Можно было бы на сервере менять статус уведолмения */
            readNotifi();
        })
        .catch(userError => {
            if (userError.response) {
                toast.error(userError.response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            }
        });
    }

    function dismissInviteTeamGame()
    {
        var conn = userContext.notificonn;
        conn.invoke("DismissInvitationToTeamGame", props.notify.pkId);
        readNotifi();
    }
    // ---------------------------------------------------------------------------------------- //    

    function getButtonBlock(notifi) {
        switch (notifi.type) {
            case "text": return <ReadBlock readNotifi={readNotifi} />;
            case "requestforgame": return <RequestBlock dismissRequest={dismissRequestGame}
                                                        acceptRequest={acceptRequestGame} />;
            case "requestforteam": return <RequestBlock dismissRequest={dismissRequestTeam}
                                                        acceptRequest={acceptRequestTeam} />;
            case "requestforteamgame": return <RequestBlock dismissRequest={dismissRequestTeamGame}
                                                        acceptRequest={acceptRequestTeamGame} />;
            case "requstforinviteteam": return <RequestBlock dismissRequest={dismissInviteTeam}
                                                             acceptRequest={acceptInviteTeam} />;
            case "requesttoinvitegame": return <RequestBlock dismissRequest={dismissInviteGame}
                                                             acceptRequest={acceptInviteGame} />;
            case "requesttoinviteteamgame": return <RequestBlock dismissRequest={dismissInviteTeamGame}
                                                                 acceptRequest={acceptInviteTeamGame} />;
            default: return;
        }
    }

    // ---------------------------------------------------------------------------------------- //

    return (
        <div className="notif-container">
            <div className="notif-back-block" />
            <div className="row notif-block-content">
                <div className="col-7 notif-block-column">
                    <div className="row notif-text">
                        {props.notify.text}
                    </div>
                </div>
                <div className="col-2 notif-block-column column-date">
                    <div className="row m-0">
                        {(new Date(props.notify.date)).toLocaleString().substring(0, (new Date(props.notify.date)).toLocaleString().length - 3)}
                    </div>
                </div>
                {props.notify.status === 0 ?
                    <div className="col-3 notif-block-column">
                        {getButtonBlock(props.notify)}
                    </div>
                    : null}
            </div>
        </div>
    );
}
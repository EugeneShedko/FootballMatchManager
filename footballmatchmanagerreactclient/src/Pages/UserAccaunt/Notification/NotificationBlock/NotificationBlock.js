import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../../index";
import { useContext, useEffect, useState } from "react";
import ReadBlock from "./ReadBlock";
import RequestBlock from "./RequestBlock";

import "./../../../../css/Notification/NotificationBlock.css";

export default function NotificationBlock(props) {

    const { user } = useContext(Context);

    /* Выношу в данное место все функции */

    function dismissRequestGame() {
        /* Плохо сделано, потому что выходит как бы некое разделение */
        /* Может хреново отработать */
        /* Пока что оставлю так*/

        var conn = user.getNotifiHubConn;
        conn.invoke("DismissReqGame", props.notify.pkId);

        readNotifi();
    }

    function acceptRequestGame() {
        /* Плохо сделано, потому что выходит как бы некое разделение */
        /* Может хреново отработать */
        /* Пока что оставлю так*/

        const data = new FormData();
        data.append("gameId", props.notify.entityId);
        data.append("userId", props.notify.fkSenderId);

        axios.post('http://localhost:5004/api/profile/add-to-game', data, { withCredentials: true })
            .then((response) => {
                var conn = user.getNotifiHubConn;
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
                props.setNotifiList(response.data);
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
            var conn = user.getNotifiHubConn;
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

    function dismissRequestTeam()
    {
        var conn = user.getNotifiHubConn;
        conn.invoke("DismissReqTeam", props.notify.pkId);
        readNotifi();
    }

    // ---------------------------------------------------------------------------------------- //

    function getButtonBlock(notifi) {
        switch (notifi.type) {
            case "text": return <ReadBlock readNotifi={readNotifi} />; break;
            case "requestforgame": return <RequestBlock dismissRequest={dismissRequestGame}
                                                        acceptRequest={acceptRequestGame} />; break;
            case "requestforteam": return <RequestBlock dismissRequest={dismissRequestTeam}
                                                        acceptRequest={acceptRequestTeam} />; break;
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
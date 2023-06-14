import axios from "axios";
import { useEffect, useState } from "react";
import NotificationGenerator from "./NotificationGenerator";
import { toast } from "react-toastify";

import "./../../../../css/Notification/NotificationView.css"

export default function Notifications()
{

    const [notifiList, setNotifiList] = useState([]);

    // ------------------------------------------------------- //

    useEffect(
        () => {

            axios.get('http://localhost:5004/api/notification/user-notif', { withCredentials: true })
                 .then((response) => {
                    setNotifiList(response.data);
                 })
                 .catch(userError => {
                    if (userError.response) {

                        console.log("Ошибка получения уведомлений");
                    }
                });   
        }, []);

    // ------------------------------------------------------- //

    return(
        <div className="row notifview-main-container">
            <div className="col notifview-container">
                <NotificationGenerator notifiList    = {notifiList}
                                       setNotifiList = {setNotifiList}
                                       />
            </div>
        </div>
    );
}
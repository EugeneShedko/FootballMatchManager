import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef} from "react";
import { Context } from "../index";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";
import axios from "axios";

import "./../css/userprofile.css";
import UserAccauntPage from './UserAccauntPage';
import AdminAccauntPage from './AdminAccauntPage';

export default function UserProfile() {

    const { userContext, setUserContext } = useContext(Context);
    const navigate = useNavigate();
    const connection = useRef(null);

    // --------------------------------------------------------- //

    useEffect(() => {

        notifiFunction();

        return (() => {

            if (connection.current) {
                connection.current.stop();
            }
        })
    }, [])

    // --------------------------------------------------------- //

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
            .withAutomaticReconnect()
            .build();


        connect.on("displayNotifi", displayNotifMess);
        connect.on("displayNotifiError", displayNotifiError);
        connect.on("displayNotifiInfo", displayNotifiInfo);
        connect.on("blockUser", displayNotifiBlock);

        /*
        connect.onclose(() => {
            connectGame();
        })
        */

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

        setUserContext(prevContext => ({
            ...prevContext, notifiCount: count, notificonn: connection.current
        }));
    }

    // --------------------------------------------------------- //

    const displayNotifiBlock = async (message) => {

        toast.error(message,
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                contentClassName: 'custom-toast'
            });

        setUserContext(prevContext => ({
            ...prevContext, isAuth: false
        }));

    }

    // --------------------------------------------------------- //

    const displayNotifiInfo = async (message) => {

        toast.info(message,
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });

        let count = await getNotReadNotifiCount();
        
        setUserContext(prevContext => ({
            ...prevContext, notifiCount: count, notificonn: connection.current
        }));

    }
    
    // --------------------------------------------------------- //

    return (
        <>
            {userContext.isAuth ? <UserAccauntPage /> 
            : 
               userContext.isAdmin ? <AdminAccauntPage />
                :
                null}
        </>
    )
}
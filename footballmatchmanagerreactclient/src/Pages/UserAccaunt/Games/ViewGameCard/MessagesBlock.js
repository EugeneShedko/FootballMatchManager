import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import MessageBlock from "./GameCardButton/MessageBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Context } from "../../../..";


export default function MessagesBlock(props) {

    const { userContext } = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [curMessage, setCurMessage] = useState("");
    const connection = useRef(null);
    const messagesContainer = useRef(null);

    // -------------------------------------------------------------------- //

    useEffect(() => {
        axios.get('http://localhost:5004/api/message/entity-messages/' + props.entityType + '/' + props.entityId, { withCredentials: true })
            .then((response) => {
                setMessages(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log('Не удалось получить сообщения матча');
                }
            });

        switch (props.entityType) {
            case "game": connectMessage(); break;
            case "teamgame": connectMessageTeamGame(); break;
            case "team": connectMessageTeam(); break;
            default: break;
        }

        return () => {
            if (connection.current) {
                connection.current.stop();
            }
        };
    }, [props.entityId]);

    // -------------------------------- Подключение к чату индивидуальных игр ---------------------------------------- //

    const connectMessage = async () => {
        const hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/gamechat").build();

        hubConnection.on("displayMess", function (message) {
            setMessages(gameMessage => [...gameMessage, message]);
        });

        await hubConnection.start();

        connection.current = hubConnection;

        await hubConnection.invoke("Connect", String(props.entityId));
    }

    // -------------------------------- Подключение к чату командных игр ---------------------------------------- //

    const connectMessageTeamGame = async () => {
        const hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/teamgamechat").build();

        hubConnection.on("displayMess", function (message) {
            setMessages(gameMessage => [...gameMessage, message]);
        });

        await hubConnection.start();

        connection.current = hubConnection;

        await hubConnection.invoke("Connect", String(props.entityId));
    }

    // -------------------------------- Подключение к чату команд ---------------------------------------- //

    const connectMessageTeam = async () => {
        const hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/teamchat").build();

        hubConnection.on("displayMess", function (message) {
            setMessages(gameMessage => [...gameMessage, message]);
        });

        await hubConnection.start();

        connection.current = hubConnection;

        await hubConnection.invoke("Connect", String(props.entityId));
    }

    // ---------------------------------- Скролл сообщений -------------------------------------- //

    useEffect(() => {
        messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }, [messages]);

    // ---------------------------------------------------------------------------------------------------------- //

    function sendMessage() {

        if (curMessage === '') {
            return;
        }
        connection.current.invoke("SendMess", curMessage, parseInt(props.entityId, 10));

        setCurMessage("");
    }

    // ----------------------------- Удаление сообщения ------------------------------------------------------ //

    function deleteMessage(messageId)
    {
        /* Удаление сообщения на сервере */
        axios.delete('http://localhost:5004/api/message/delete-message/' + messageId, { withCredentials: true })
            .then((response) => {
                setMessages(prevMessages => prevMessages.filter(iteam => iteam.pkId !== messageId));
            })
            .catch(userError => {
                if (userError.response) {
                    console.log('DELETE MESSAGE');
                    console.log(userError.response.message);
                }
            });
    }

    // ---------------------------------------------------------------------------------------------------------- //

    return (
        <>
            <div id="xren" className="tg-info-message-container" ref={messagesContainer}>
                <div id="xren2" className="match-info-message-absolute-container">
                    <div className="row m-0">
                        {
                            messages.map((message) => <MessageBlock messageInfo={message}
                                                                    deleteMessage={deleteMessage} />)
                        }
                    </div>
                </div>
            </div>
            {userContext.isAuth ?
                <div className="row message-send-container">
                    <div className="col-9 message-send-area">
                        <textarea className="message-enter-button"
                            type="text"
                            placeholder="Сообщение..."
                            value={curMessage}
                            onChange={(e) => setCurMessage(e.target.value)}
                        />
                    </div>
                    <div className="col-3 p-0">
                        <input className="message-send-button"
                            value="Отправить"
                            type="button"
                            onClick={sendMessage}
                        />
                    </div>
                </div>
                : null}
        </>
    );
}
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useRef, useState} from "react";
import MessageBlock from "./GameCardButton/MessageBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";


export default function MessagesBlock(props) {

    const [messages, setMessages] = useState([]);
    const [curMessage, setCurMessage] = useState("");
    const connection = useRef(null);
    const messagesContainer = useRef(null);


    useEffect(() => {
        axios.get('http://localhost:5004/api/message/game-messages/' + props.gameId, { withCredentials: true })
        .then((response) => {
            setMessages(response.data);
        })
        .catch(userError => {
            if (userError.response) {
                console.log('Не удалось получить сообщения матча');
            }
        });

        connectMessage();
        console.log('RENDER' + props.gameId);

        return () => {
            if (connection.current) {
              console.log('MESSAGE STOP');
              connection.current.stop();
            }
          };
    }, [props.gameId]); 

    // ---------------------------------------------------------------------------------------------------------- //

    const connectMessage = async () => {
        const hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/gamechat").build();

        hubConnection.on("displayMess", function (message) {
           setMessages(gameMessage => [...gameMessage, message]);
        });

        await hubConnection.start();

        connection.current = hubConnection;

        await hubConnection.invoke("Connect", String(props.gameId));
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

        console.log('GAMEID');
        console.log(props.gameId, curMessage);

        /* Посмотреть этот метод на сервере */
        /* Посмотреть, как сделаны эти методы */
        connection.current.invoke("SendMess", curMessage, parseInt(props.gameId, 10));
        
        setCurMessage("");
    }

    // ---------------------------------------------------------------------------------------------------------- //

    return (
        <>
            <div id="xren" className="match-info-message-container" ref={messagesContainer}>
                <div id="xren2" className="match-info-message-absolute-container">
                    <div className="row m-0">
                        {
                            messages.map((message) => <MessageBlock messageInfo={message} />)
                        }
                    </div>
                </div>
            </div>
            <div className="row message-send-container">
                <div className="col-9 message-send-area">
                    <input className="message-enter-button"
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
        </>
    );
}
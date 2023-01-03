/*Инфу скорее всего получать через props*/
/*Получился двойной props, не факт, что получиться передать*/

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../css/matchinfopage.css"
import PlayerBlock from "./PlayerBlock";
import { Context } from "../index"
import Matches from "./userprofile/Matches";
import EditGame from "./userprofile/EditGame";
import MessageBlock from "./userprofile/MessageBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";


export default function MatchInfoPage(props) {

    const { user } = useContext(Context);
    const [game, setGame] = useState({});
    const [gameUsers, setGameUsers] = useState([]);
    const [isPart, setIsPart] = useState(false);
    const [isCreat, setIsCreat] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [changes, setChanges] = useState({
        gameId: 0,
        gameName: "",
        gameDate: new Date(),
        gameFormat: "",
        gameAdress: "",
    });
    const [curMessage, setCurMessage] = useState("");
    const [gameMessage, setGameMessage] = useState([]);
    const [connection, setConnection] = useState({});

    useEffect(() => {

        axios.get('http://localhost:5000/api/profile/game/' + props.gameId + "/" + user.getUserId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.currgame);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);
            })
            .then(() => {
                axios.get('http://localhost:5000/api/profile/matchUsers/' + props.gameId, { withCredentials: true })
                    .then((response) => {
                        setGameUsers(response.data);
                    })
                    .catch(userError => {
                        if (userError.response) {
                            toast.error(userError.response.message,
                                {
                                    position: toast.POSITION.TOP_CENTER,
                                    autoClose: 2000,
                                    pauseOnFocusLoss: false
                                });
                        }
                    });
            })
            .then(() => {
                axios.get('http://localhost:5000/api/profile/allmessages/' + props.gameId, { withCredentials: true })
                    .then((response) => {
                        setGameMessage(response.data);
                    })
                    .catch(userError => {
                        if (userError.response) {
                            toast.error("Не удалось получить сообщения матча",
                                {
                                    position: toast.POSITION.TOP_CENTER,
                                    autoClose: 2000,
                                    pauseOnFocusLoss: false
                                });
                        }
                    });
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

            connectMessage();  

        }, []);

    const connectMessage = async () => {
        const hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5000/gamechat").build();

        hubConnection.on("Send", (messageUserName, messageDate, messageText, userImage) => {
            setGameMessage(gameMessage => [...gameMessage, { messageUserName, messageDate, messageText, userImage}]);
        }); 
        
        await hubConnection.start();
        setConnection(hubConnection);

        await hubConnection.invoke("Connect", String(props.gameId));
    }    

    function addToMatch() {

        const data = new FormData();
        data.append("gameId", props.gameId);
        data.append("userId", user.getUserId);

        axios.post('http://localhost:5000/api/profile/addtomatch', data, { withCredentials: true })
            .then((response) => {
                setGameUsers(response.data.users);
                setGame(response.data.currgame);
                setIsPart(true);
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
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

    function leaveMatch() {

        axios.delete('http://localhost:5000/api/profile/leavefromgame/' + props.gameId + '/' + user.getUserId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                setGame(response.data.currgame);
                setGameUsers(response.data.users);
                setIsPart(false);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message,
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

    }

    function deleteMatch() {
        axios.delete('http://localhost:5000/api/profile/deletegame/' + game.gameId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                props.setGames(response.data.rgames);
                props.setContState(<Matches setContState={props.setContState} />);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message,
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

    }

    function editGame() {
        setChanges({
            gameId: game.gameId,
            gameName: game.gameName,
            gameDate: new Date(game.gameDateTime),
            gameFormat: game.gameFormat,
            gameAdress: game.gameAdress,
        });
        setEditProfileVisible(true);
    }

    function sendMessage() {

        if(curMessage === '')
        {
            return;
        }

        const data = new FormData();
        data.append("MessageText", curMessage);
        data.append("GameRecipient", props.gameId);
        data.append("MessageSender", user.getUserId);

        axios.post('http://localhost:5000/api/profile/addmessage', data, { withCredentials: true })
            .then((response) => {
                console.log("запрос ответ");
                connection.invoke("Send", user.getUserName,
                    response.data.messageDateTime,
                    response.data.messageText,
                    String(response.data.gameId),
                    String(user.getUserId)
                );
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error("Ошибка отправки сообщения",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

        setCurMessage("");
    }

    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-10 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-4 match-info-text-container">
                        <div className="row match-info-title">
                            {game.gameName}
                        </div>
                        <div className="row match-info-header">
                            Время матча
                        </div>
                        <div className="row match-info-text">
                            {(new Date(game.gameDateTime)).toLocaleString().substring(0, (new Date(game.gameDateTime)).toLocaleString().length - 3)}
                        </div>
                        <div className="row match-info-header">
                            Формат матча
                        </div>
                        <div className="row match-info-text">
                            {game.gameFormat}
                        </div>
                        <div className="row match-info-header">
                            Адрес
                        </div>
                        <div className="row match-info-text">
                            {game.gameAdress}
                        </div>
                        <div className="row match-info-header">
                            Текущее количество игроков
                        </div>
                        {/*можно вывести еше максимальное*/}
                        <div className="row match-info-text">
                            {game.currentPlayers}
                        </div>
                        <div className="row match-join-button-container">
                            {isPart ? null : <input className="match-join-button" type="button" value="Присоединиться" onClick={addToMatch} />}
                            {isPart ? <input className="match-join-button"
                                type="button"
                                value="Покинуть"
                                onClick={leaveMatch} /> : null}
                            {isCreat ? <input className="match-join-button"
                                type="button"
                                value="Редактировать"
                                onClick={editGame} /> : null}
                            {isCreat ? <input className="match-join-button"
                                type="button"
                                value="Удалить"
                                onClick={deleteMatch} /> : null}
                        </div>
                    </div>
                    {
                        <div className="col-4 match-info-user-container">
                            <div className="match-info-user-absolute-container">
                                {
                                    gameUsers.map((player) => (
                                        <div className="row m-0">
                                            <PlayerBlock info={player} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                    <div className="col-4 h-100 p-0">
                        <div className="match-info-message-container">
                            <div className="match-info-message-absolute-container">
                                <div className="row m-0">
                                    {
                                        gameMessage.map((message) => <MessageBlock messageInfo={message} />)
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
                                    onChange={(e) => setCurMessage(e.target.value)} />
                            </div>
                            <div className="col-3 p-0">
                                <input className="message-send-button"
                                    value="Отправить"
                                    type="button"
                                    onClick={sendMessage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditGame setGame={setGame}
                info={changes}
                setInfo={setChanges}
                show={editProfileVisible}
                onHide={setEditProfileVisible}
            />

        </div>
    );
}    
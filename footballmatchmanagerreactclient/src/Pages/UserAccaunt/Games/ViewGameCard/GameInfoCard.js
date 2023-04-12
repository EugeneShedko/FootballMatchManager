
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerBlock from "./../../Players/ViewPlayers/PlayerBlock";
import { Context } from "../../../../index";
import Matches from "../ViewGames/Games";
import EditGame from "./EditGame";
import { HubConnectionBuilder } from "@microsoft/signalr";
import CreatorButton from "./GameCardButton/CreatorButtons";
import UserButton from "./GameCardButton/UserButtons";
import MessagesBlock from "./MessagesBlock";

import "./../../../../css/GameInfoCard.css";

export default function GameInfoCard(props) {

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
    const [notconn, setNotConn] = useState({});

    // ---------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/profile/game/' + props.gameId + "/" + user.getUserId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.currgame);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/profile/game-users/' + props.gameId, { withCredentials: true })
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
                axios.get('http://localhost:5004/api/message/game-messages/' + props.gameId, { withCredentials: true })
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

    }, []);

    // ---------------------------------------------------------------------------------------- //

    function addToMatch() {

        const data = new FormData();
        data.append("gameId", props.gameId);
        data.append("userId", user.getUserId);

        axios.post('http://localhost:5004/api/profile/add-to-game', data, { withCredentials: true })
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

        var conn = user.getNotifiHubConn;
        conn.invoke("Game", String(props.gameId), "addtogame");
    }

    function sendRequestForPart() {
        var conn = user.getNotifiHubConn;
        conn.invoke("Game", String(props.gameId), "requestforpart");

        /* Плохо, что так сделано скорее всего нужно выносить в отдельный метод */
        /* На сервере и возвращать от туда сообщение */
        /* Пока что оставлю так */  

        /* Возможно строку можно было бы возвращать из хаба */
        toast.success("Ваш запрос на участие в матче отправлен",
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnFocusLoss: false
            });

    }

    // ---------------------------------------------------------------------------------------- //

    function leaveMatch() {

        axios.delete('http://localhost:5004/api/profile/leave-from-game/' + props.gameId + '/' + user.getUserId, { withCredentials: true })
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

        var conn = user.getNotifiHubConn;
        conn.invoke("Game", String(props.gameId), "leavefromgame");
    }

    // ---------------------------------------------------------------------------------------- //

    function deleteMatch() {
        axios.delete('http://localhost:5004/api/profile/delete-game/' + game.pkId, { withCredentials: true })
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

    // ---------------------------------------------------------------------------------------- //

    function editGame() {
        setChanges({
            gameId: game.pkId,
            gameName: game.name,
            gameDate: new Date(game.dateTime),
            gameFormat: game.format,
            gameAdress: game.adress,
        });
        setEditProfileVisible(true);
    }

    // ---------------------------------------------------------------------------------------- //

    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-10 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-4 match-info-text-container">
                        <div className="row match-info-title">
                            {game.name}
                        </div>
                        <div className="row match-info-header">
                            Время матча
                        </div>
                        <div className="row match-info-text">
                            {(new Date(game.dateTime)).toLocaleString().substring(0, (new Date(game.dateTime)).toLocaleString().length - 3)}
                        </div>
                        <div className="row match-info-header">
                            Формат матча
                        </div>
                        <div className="row match-info-text">
                            {game.format}
                        </div>
                        <div className="row match-info-header">
                            Адрес
                        </div>
                        <div className="row match-info-text">
                            {game.adress}
                        </div>
                        <div className="row match-info-header">
                            Текущее количество игроков
                        </div>
                        {/*можно вывести еше максимальное*/}
                        <div className="row match-info-text">
                            {game.currPlayers}/{game.maxPlayers}
                        </div>
                        <div className="row match-join-button-container">
                            <UserButton game = {game}
                                        isPart = {isPart}
                                        leaveMatch = {leaveMatch}
                                        sendRequestForPart = {sendRequestForPart}
                                        addToMatch = {addToMatch}
                                        />
                            {isCreat ? <CreatorButton editGame={editGame}
                                                      deleteMatch={deleteMatch} />
                            : null}

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
                        {isPart ? <MessagesBlock gameId = {props.gameId}/> : null}
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
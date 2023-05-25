
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../../index";
import MessagesBlock from "./MessagesBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";

import "./../../../../css/GameInfoCard.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_EDIT_GAME, TO_GAMES } from "../../../../Utilts/Consts";
import GameParticipantPlayers from "./GameCardButton/GameParticipantPlayers";
import GameEventsContainer from "../../TeamGames/ViewTeamGameInfoCard/GameEventsContainer";
import GameUserButtons from "./GameCardButton/GameUserButtons";

export default function GameInfoCard(props) {

    const navigate = useNavigate();
    const { userContext } = useContext(Context);
    const location = useLocation();
    const [gameId, setGameId] = useState(useParams().id);
    const [game, setGame] = useState({});
    const [isPart, setIsPart] = useState(false);
    const [isCreat, setIsCreat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    /* События матча */
    const [gameEvents, setGameEvents] = useState([]);
    /* Обновление участников матча */
    const [refreshGameUser, setRefreshGameUsers] = useState(false);
    /* Обновление матча */
    const [refreshGame, setRefreshGame] = useState(false);
    /* Соединение с хабом удаления */
    const deleteHubConnection2 = useRef(null);
    /* Айди пользователя организатора матча */
    const [gameCreatorId, setGameCreatorId] = useState();

    // ---------------------------------------------------------------------------------------- //

    useEffect(() => {

        /* Вычитывать передачу пользователя на сервере!!!!!!! */
        axios.get('http://localhost:5004/api/profile/game/' + gameId + "/" + userContext.userId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.currgame);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);
                setGameCreatorId(response.data.creatorID);

                if (response.data.currgame.status === 3) {
                    getGameEvents();
                }

                connectToDelete2();
                setIsLoading(true);
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

        return () => {

            if (deleteHubConnection2.current) {
                deleteHubConnection2.current.stop();
            }
        };

    }, [refreshGame]);

    // ------------------------------ Перечитывает данные при обновлении матча ----------------------------------- //
    /* Тупой метод, все равно компонент обновляется */
    /* Пока что пускай будет*/

    useEffect(() => {
        axios.get('http://localhost:5004/api/profile/game/' + gameId + "/" + userContext.userId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.currgame);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);

                if (response.data.currgame.status === 3) {
                    getGameEvents();
                }

                setIsLoading(true);

            }).catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }, [location.state && location.state.refresh]);


    // ---------------------  Подключение к хабу удаления -------------------------- //

    const connectToDelete2 = async () => {

        const hubDeleteConnection2 = new HubConnectionBuilder().withUrl("http://localhost:5004/game").build();

        hubDeleteConnection2.on("deleteGame", () => {
            navigate(TO_GAMES);
        });

        hubDeleteConnection2.on("refreshgame", () => {
            setRefreshGame(!refreshGame);
        });

        await hubDeleteConnection2.start();

        await hubDeleteConnection2.invoke("Connect", String(gameId));

        deleteHubConnection2.current = hubDeleteConnection2;
    }


    // ---------------------------------------------------------------------------------------- //

    function addToMatch() {

        const data = new FormData();
        data.append("gameId", gameId);
        data.append("userId", userContext.userId);

        axios.post('http://localhost:5004/api/profile/add-to-game', data, { withCredentials: true })
            .then((response) => {

                setRefreshGame(!refreshGame);

                var conn = userContext.notificonn;
                conn.invoke("Game", String(gameId), "addtogame");
                //Убрать вычитывание пользователей на стороне сервера
                //setGameUsers(response.data.users);

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

    // ---------------------------------------------------------------------------------------- //

    function sendRequestForPart() {
        var conn = userContext.notificonn;
        conn.invoke("Game", gameId, "requestforgame");

        // Отправлять сообщение с хаба!!!!! 

        toast.success("Ваш запрос на участие в матче отправлен",
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                pauseOnFocusLoss: false
            });
    }

    // ---------------------------------------------------------------------------------------- //

    function leaveMatch() {

        /* Вычитывать пользователя на сервере */
        axios.delete('http://localhost:5004/api/profile/leave-from-game/' + gameId + '/' + userContext.userId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

                setRefreshGame(!refreshGame);

                //Убрать вычитывание пользователей на стороне сервера
                //setGameUsers(response.data.users);

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

        /* Почему оно стоит здесь?, перенести под успешный ответ */
        var conn = userContext.notificonn;
        conn.invoke("Game", gameId, "leavefromgame");
    }

    // ---------------------------------------------------------------------------------------- //

    function deleteMatch() {
        axios.delete('http://localhost:5004/api/profile/delete-game/' + gameId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

                navigate(TO_GAMES);
            })
            .catch((error) => {
                if (error.response) {
                    console.log('DELETE GAME');
                    console.log(error.response.data.message);
                }
            });

    }

    // ---------------------------------------------------------------------------------------- //

    function editGame() {

        navigate(location.pathname + TO_EDIT_GAME, {
            state: {
                gameId: game.pkId,
                gameName: game.name,
                gameDate: new Date(game.dateTime),
                gameFormat: game.format,
                gameAdress: game.adress,
            }
        });
    }

    // ---------------------------------------------------------------------------------------- //

    function getGameEvents() {
        axios.get('http://localhost:5004/api/gameevent/game-events/' + gameId, { withCredentials: true })
            .then((response) => {
                setGameEvents(response.data);
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
    }

    // ---------------------------------------------------------------------------------------- //

    function deleteUser(userId) {

        axios.delete('http://localhost:5004/api/profile/delete-game-user/' + gameId + '/' + userId, { withCredentials: true })
            .then((response) => {

                game.currPlayers = game.currPlayers - 1;
                setRefreshGameUsers(!refreshGameUser);

                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
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

    }

    // ---------------------------------------------------------------------------------------- //

    if (isLoading) {
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
                            <div className="row match-info-text">
                                {game.currPlayers}/{game.maxPlayers}
                            </div>
                            <div className="row match-join-button-container">
                                <GameUserButtons isCreat={isCreat}
                                                 gameStatus={game.status}
                                                 editGame={editGame}
                                                 deleteMatch={deleteMatch} 
                                                 /* Участник */
                                                 game={game}
                                                 isPart={isPart}
                                                 leaveMatch={leaveMatch}
                                                 sendRequestForPart={sendRequestForPart}
                                                 addToMatch={addToMatch}
                                                 />
                            </div>
                        </div>
                        <div className="col-4 match-info-user-container">
                            {
                                game.status === 3 ? <GameEventsContainer mode="view"
                                    events={gameEvents}
                                />
                                    : <GameParticipantPlayers gameId={gameId}
                                        refresh={refreshGameUser}
                                        refreshGame={refreshGame}
                                        isCreat={isCreat}
                                        deleteUser={deleteUser}
                                        gameCreatroId={gameCreatorId}
                                    />
                            }
                        </div>
                        <div className="col-4 h-100 p-0">
                            {isPart || userContext.isAdmin ? <MessagesBlock entityId={gameId}
                                entityType="game" />
                                : null}
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}    
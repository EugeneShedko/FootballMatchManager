
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerBlock from "./../../Players/ViewPlayers/PlayerBlock";
import { Context } from "../../../../index";
import CreatorButton from "./GameCardButton/CreatorButtons";
import MessagesBlock from "./MessagesBlock";

import "./../../../../css/GameInfoCard.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_EDIT_GAME, TO_GAMES } from "../../../../Utilts/Consts";
import ParticipanButtons from "../../TeamGames/ViewTeamGameInfoCard/ParticipantButtons";
import ParticipantButton from "./GameCardButton/ParticipantButtons";
import GameParticipantPlayers from "./GameCardButton/GameParticipantPlayers";
import GameEventsContainer from "../../TeamGames/ViewTeamGameInfoCard/GameEventsContainer";

export default function GameInfoCard(props) {

    const navigate = useNavigate();
    const { userContext } = useContext(Context);
    const location = useLocation()
    const [gameId, setGameId] = useState(useParams().id);
    const [game, setGame] = useState({});
    /* ЗДЕСЬ ПРОБЛЕМА С ПОЛЬЗОВАТЕЛЯМИ */
    /* ТО ЧТО Я ВЫНЕС ИХ В ОТДЕЛЬНЫЙ КОМПОНЕНТ*/
    const [gameUsers, setGameUsers] = useState([]);
    const [isPart, setIsPart] = useState(false);
    const [isCreat, setIsCreat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    /* События матча */
    const [gameEvents, setGameEvents] = useState([]);
    const [refreshGameUser, setRefreshGameUsers] = useState(false);

    // ---------------------------------------------------------------------------------------- //

    useEffect(() => {

        /* Вычитывать передачу пользователя на сервере!!!!!!! */
        axios.get('http://localhost:5004/api/profile/game/' + gameId + "/" + userContext.userId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.currgame);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);

                if (response.data.currgame.status === 3)
                {
                    getGameEvents();
                }

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

    }, []);

    // ------------------------------ Перечитывает данные при обновлении матча ----------------------------------- //
    /* Тупой метод, все равно компонент обновляется */
    /* Пока что пускай будет*/

    useEffect(() => {
        axios.get('http://localhost:5004/api/profile/game/' + gameId + "/" + userContext.userId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.currgame);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);

                if (response.data.currgame.status === 3)
                {
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

    // ---------------------------------------------------------------------------------------- //

    function addToMatch() {

        const data = new FormData();
        data.append("gameId", gameId);
        data.append("userId", userContext.userId);

        axios.post('http://localhost:5004/api/profile/add-to-game', data, { withCredentials: true })
            .then((response) => {

                setRefreshGameUsers(!refreshGameUser);
                //Убрать вычитывание пользователей на стороне сервера
                //setGameUsers(response.data.users);
                
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

        var conn = userContext.notificonn;
        conn.invoke("Game", String(props.gameId), "addtogame");
    }

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
                setGame(response.data.currgame);

                setRefreshGameUsers(!refreshGameUser);
                //Убрать вычитывание пользователей на стороне сервера
                //setGameUsers(response.data.users);
                
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

    function getGameEvents()
    {
        axios.get('http://localhost:5004/api/gameevent/game-events/' + gameId, { withCredentials: true })
        .then((response) => {
            console.log('RESDATA');
            console.log(response.data);
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
                            {/*можно вывести еше максимальное*/}
                            <div className="row match-info-text">
                                {game.currPlayers}/{game.maxPlayers}
                            </div>
                            <div className="row match-join-button-container">
                                {isCreat ? <CreatorButton gameStatus={game.status}
                                    editGame={editGame}
                                    deleteMatch={deleteMatch} />
                                    :
                                    <ParticipantButton game={game}
                                        isPart={isPart}
                                        leaveMatch={leaveMatch}
                                        sendRequestForPart={sendRequestForPart}
                                        addToMatch={addToMatch}
                                    />}

                            </div>
                        </div>
                        <div className="col-4 match-info-user-container">
                            {
                                game.status === 3 ? <GameEventsContainer mode="view"
                                                    events={gameEvents}
                                />
                                    : <GameParticipantPlayers gameId={gameId}
                                                              refresh={refreshGameUser} />
                            }
                        </div>
                        <div className="col-4 h-100 p-0">
                            {isPart ? <MessagesBlock gameId={gameId} /> : null}
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}    
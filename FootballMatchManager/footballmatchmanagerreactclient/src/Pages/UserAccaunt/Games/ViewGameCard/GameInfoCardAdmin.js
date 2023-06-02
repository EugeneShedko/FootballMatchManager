
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../../index";
import MessagesBlock from "./MessagesBlock";

import "./../../../../css/GameInfoCard.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_GAMES } from "../../../../Utilts/Consts";
import GameParticipantPlayers from "./GameCardButton/GameParticipantPlayers";
import GameEventsContainer from "../../TeamGames/ViewTeamGameInfoCard/GameEventsContainer";
import GameUserButtons from "./GameCardButton/GameUserButtons";
import GameAdminButtons from "./GameCardButton/GameAdminButtons";

export default function GameInfoCardAdmin(props) {

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

    }, [refreshGame]);


    // ---------------------------------------------------------------------------------------- //

    function deleteMatch() {

        console.log('DELETE GAME FUNC');

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
                                <GameAdminButtons deleteMatch={deleteMatch} />
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
                             <MessagesBlock entityId={gameId}
                                            
                                            entityType="game" />
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}    
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import MessagesBlock from "../../Games/ViewGameCard/MessagesBlock";
import PlayerBlock from "../../Players/ViewPlayers/PlayerBlock";
import { toast } from "react-toastify";
import { useAsyncError, useParams } from "react-router-dom";
import { Context } from "../../../..";
import CreatorButtons from "./CreatorButtons";
import ParticipanButtons from "./ParticipantButtons";

import "./../../../../css/TeamsGames/TeamGameInfoCard.css";
import ParticipantPlayers from "./ParticipantPayers";
import GameEventsContainer from "./GameEventsContainer";

export default function TeamGameCard() {

    /* Можно было много чего в какой-то один объект запихнуть */
    const { userContext } = useContext(Context);

    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const [game, setGame] = useState({});
    const [creatorId, setCreatorId] = useState();
    const [secTeamCreatorId, setSecTeamCreator] = useState();
    const [isPart, setIsPart] = useState();
    const [firstTeamUsers, setFirstTeamUsers] = useState([]);
    const [secondTeamUsers, setSecondTeamUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReload, setIsReload] = useState(false);
    /* События матча */
    const [gameEvents, setGameEvents] = useState([]);

    // ---------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/teamgame/team-game/' + gameId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.game);

                if (response.data.game.status < 3) {
                    getTeamUsers(response.data.game.firstTeam.pkId, setFirstTeamUsers);
                    getTeamUsers(response.data.game.secondTeam.pkId, setSecondTeamUsers);
                }
                else {
                    getTeamGameEvents();
                }

                setCreatorId(response.data.creatorId);
                setSecTeamCreator(response.data.secTeamCreatorId)
                setIsPart(response.data.isPart);
                setIsLoading(true);
                setIsReload(false);
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

    }, [isReload]);

    // ----------------------------------------------------------------------------------------------------------- //    

    function getTeamUsers(teamId, setUsers) {

        axios.get('http://localhost:5004/api/teamgame/team-users/' + teamId, { withCredentials: true })
            .then((response) => {
                setUsers(response.data);
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

    // ----------------------------------------------------------------------------------------------------------- //    

    function getTeamGameEvents() {

        axios.get('http://localhost:5004/api/gameevent/team-game-events/' + gameId, { withCredentials: true })
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

    // ----------------------------------------------------------------------------------------------------------- //    

    function sendReqForTeamGamePart() {
        var conn = userContext.notificonn;
        conn.invoke("RequestToAddTeamGame", gameId);
    }

    // ----------------------------------------------------------------------------------------------------------- //    

    function leavFromTeamGame() {
        axios.delete('http://localhost:5004/api/teamgame/leave-team-game/' + gameId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

                var conn = userContext.notificonn;
                conn.invoke("LeavFromTeamGame", gameId);
                setIsReload(true);
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

    // ----------------------------------------------------------------------------------------------------------- //    

    if (isLoading) {
        return (
            <div className="row justify-content-center tg-info-main-container">
                <div className="col-12 tg-info-container">
                    <div className="row m-0 h-100">
                        <div className="col-3 tg-info-text-container">
                            <div className="row tg-info-cont">
                                <div className="col tg-info-cont-2">
                                    <div className="row tg-info-header">
                                        Нименование
                                    </div>
                                    <div className="row tg-info-text">
                                        {game.name}
                                    </div>
                                    <div className="row tg-info-header">
                                        Формат матча
                                    </div>
                                    <div className="row tg-info-text">
                                        {game.format}
                                    </div>
                                    <div className="row tg-info-header">
                                        Дата начала матча
                                    </div>
                                    <div className="row tg-info-text">
                                        {(new Date(game.dateTime)).toLocaleString().substring(0, (new Date(game.dateTime)).toLocaleString().length - 3)}
                                    </div>
                                    <div className="row tg-info-header">
                                        Адрес матча
                                    </div>
                                    <div className="row tg-info-text">
                                        {game.adress}
                                    </div>
                                </div>
                            </div>
                            <div className="row tg-button-cont">
                                <div className="col tg-button-cont-2">
                                    {
                                        userContext.userId === creatorId ?
                                            <CreatorButtons game={game} />
                                            :
                                            <ParticipanButtons game={game}
                                                sendReqForTeamGamePart={sendReqForTeamGamePart}
                                                secTeamCreatorId={secTeamCreatorId}
                                                leavFromTeamGame={leavFromTeamGame}
                                            />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-6 team-info-col">
                            <div className="row team-info-cont">
                                <div className="col-5 curr-team-info-cont">
                                    <div className="row team-name">
                                        {game.firstTeam.name}
                                    </div>
                                    <div className="row m-0 p-0">
                                        <img className="team-image"
                                            src={"http://localhost:5004/" + game.firstTeam.image}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="col-2 curr-team-info-cont">
                                    <div className="row team-game-score-cont">
                                        <div className="col-5 current-score-cont">
                                            {game.firstTeamGoals}
                                        </div>
                                        <div className="col-2 current-score-cont">
                                            -
                                        </div>
                                        <div className="col-5 current-score-cont">
                                            {game.firstTeamGoals}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5 curr-team-info-cont">
                                    <div className="row team-name">
                                        {game.secondTeam.name}
                                    </div>
                                    <div className="row m-0 p-0">
                                        <img className="team-image"
                                            src={"http://localhost:5004/" + game.secondTeam.image}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row team-user-container">
                                {
                                    game.status === 3 ? <GameEventsContainer mode="view"
                                        teamId={game.firstTeam.pkId}
                                        events={gameEvents}
                                    />
                                        : <ParticipantPlayers firstTeamUsers={firstTeamUsers}
                                            secondTeamUsers={secondTeamUsers}
                                        />
                                }
                            </div>
                        </div>
                        <div className="col-3 h-100 p-0">
                            {isPart ? <MessagesBlock gameId={gameId} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
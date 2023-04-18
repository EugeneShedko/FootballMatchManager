import axios from "axios";
import { useEffect, useState } from "react";
import MessagesBlock from "../../Games/ViewGameCard/MessagesBlock";
import "./../../../../css/TeamsGames/TeamGameInfoCard.css";
import PlayerBlock from "../../Players/ViewPlayers/PlayerBlock";
import { toast } from "react-toastify";
import { useAsyncError, useParams } from "react-router-dom";



/* Переписать стили */

/* Запрос на сервер, для получеие инфы */

export default function TeamGameCard() {

    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const [game, setGame] = useState({});
    const [firstTeamUsers, setFirstTeamUsers] = useState([]);
    const [secondTeamUsers, setSecondTeamUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 

    // ---------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/teamgame/team-game/' + gameId, { withCredentials: true })
            .then((response) => {
                setGame(response.data);
                console.log(response.data);
                setIsLoading(true);
                getTeamUsers(response.data.firstTeam.pkId, setFirstTeamUsers);
                getTeamUsers(response.data.secondTeam.pkId, setSecondTeamUsers);
                //setIsPart(response.data.isPart);
                //setIsCreat(response.data.isCreat);
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

    /* Пока что не знаю, что делать со скролом в участниках команды */
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

    if(isLoading)
    {
        return (
            <div className="row justify-content-center tg-info-main-container">
                <div className="col-12 tg-info-container">
                    <div className="row m-0 h-100">
                        <div className="col-3 tg-info-text-container">
                            <div className="row tg-info-cont">
                                <div className="col tg-info-cont-2">
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
                        </div>
                        <div className="col-3 m-0 p-0">
                            <div className="team-info-cont">
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
                            <div className="row team-user-container">
                                <div className="team-info-user-absolute-container">
                                    {
                                        firstTeamUsers?.map((player) => (
                                            <div className="row m-0">
                                                <PlayerBlock info={player} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-3 m-0 p-0">
                            <div className="team-info-cont">
                                <div className="row team-name">
                                    {/*game.secondTeam.name*/}
                                </div>
                                <div className="row m-0 p-0">
                                    <img className="team-image"
                                        src={"http://localhost:5004/" + game.secondTeam.image}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="row team-user-container">
                                <div className="team-info-user-absolute-container">
                                    {
                                        secondTeamUsers?.map((player) => (
                                            <div className="row m-0">
                                                <PlayerBlock info={player} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-3 h-100 p-0">
                            {/*isPart ? <MessagesBlock gameId={teamId} /> : null*/}
                            <MessagesBlock />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
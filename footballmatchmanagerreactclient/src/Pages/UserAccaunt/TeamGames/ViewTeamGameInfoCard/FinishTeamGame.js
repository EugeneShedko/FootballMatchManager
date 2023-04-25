import { useLocation, useParams } from "react-router-dom";
import "./../../../../css/TeamsGames/TeamGameHistory.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export default function FinishTeamGame() {

    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const [game, setGame] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [eventTypes, setEventTypes] = useState([]);
    const [teams, setTeams] = useState([]);
    /* Попробовать потом все запихать в один объект */
    const [currentEventType, setCurrentEventType] = useState("");
    const [currentTeamId, setCurrentTeamId] = useState();
    const [gameEvents, setGameEvents] = useState([]);
    const [gameEvent, setGameEvent] = useState({
        type: null,
        time: null,
        playerId: null,
    });

    // --------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/teamgame/team-game/' + gameId, { withCredentials: true })
            .then((response) => {
                setGame(response.data.game);

                getTeamUsers(response.data.game.firstTeam.pkId);
                getTeamUsers(response.data.game.secondTeam.pkId);

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

        axios.get('http://localhost:5004/api/teamgame/game-event-type', { withCredentials: true })
            .then((response) => {
                setEventTypes(response.data);
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

    // --------------------------------------------------------------- //

    function getTeamUsers(teamId) {

        axios.get('http://localhost:5004/api/teamgame/team-users/' + teamId, { withCredentials: true })
            .then((response) => {
                setTeams((prev) => [...prev, { teamId: teamId, users: response.data }]);
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

    // --------------------------------------------------------------- //

    function getEventComponent() {

        /* Обрабоатать, если не выбрана команда */
        const team = teams.find((item) => item.teamId === parseInt(currentTeamId));

        console.log('SWITCH');
        console.log(gameEvent);

        switch (currentEventType) {
            case "goal": return <PlayerForm teamUsers={team.users} />; break;
            case "yellowcard": return <PlayerForm teamUsers={team.users} />; break;
            case "redcard": return <PlayerForm teamUsers={team.users} />; break;
            case "change": return <ChangeForm teamUsers={team.users} />; break;
            default: return null;
        }
    }

    // --------------------------------------------------------------- //
    // ------------------- Вставляемые формы ------------------------- //

    /* Нужно вставлять игроков определенной команды */

    function PlayerForm(props) {
        return (
            <div className="row tgh-row">
                <select name="gameFormat"
                    className="input-style"
                    onChange={e => setGameEvent({...gameEvent, playerId: e.target.value})}
                >
                    <option selected> Выберите игрока </option>
                    {
                        props.teamUsers?.map((user) => (
                            <option value={user.pkId}>{user.firstName + ' ' + user.lastName}</option>
                        ))
                    }
                </select>
            </div>
        );
    }

    // --------------------------------------------------------------- //

    function ChangeForm(props) {
        return (
            <>
                <div className="row tgh-row">
                    <select name="gameFormat"
                        className="input-style"
                    >
                        <option selected> Игрок на замену </option>
                        {
                            props.teamUsers?.map((user) => (
                                <option>{user.firstName + ' ' + user.lastName}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="row tgh-row">
                    <select name="gameFormat"
                        className="input-style"
                    >
                        <option selected> Игрок с замены </option>
                        {
                            props.teamUsers?.map((user) => (
                                <option>{user.firstName + ' ' + user.lastName}</option>
                            ))
                        }
                    </select>
                </div>
            </>
        );
    }

    // --------------------------------------------------------------- //

    if (isLoading) {
        return (
            <div className="row tgh-info-main-container">
                <div className="col-4 tgh-info-container">
                    <div className="tgh-title">
                        Хронология
                    </div>
                    <div className="row tgh-info-cont">
                        <div className="col m-0 p-0">
                            <div className="row tgh-row">
                                <select name="gameFormat"
                                    className="input-style"
                                    onChange={e => setCurrentTeamId(e.target.value)}
                                >
                                    <option selected>Выберите команду</option>
                                    <option value={game.firstTeam.pkId} >{game.firstTeam.name}</option>
                                    <option value={game.secondTeam.pkId}>{game.secondTeam.name}</option>
                                </select>
                            </div>
                            <div className="row tgh-row">
                                <input name="gameName"
                                    className="input-style"
                                    type="text"
                                    placeholder="Введите минуту события"
                                    onChange={(e) => setGameEvent({...gameEvent, time: e.target.value})}
                                />
                            </div>
                            <div className="row tgh-row">
                                <select name="gameFormat"
                                    className="input-style"
                                    /* Записывается тип, что не хорошо */
                                    /* Я бы даже сказал очень хреново */
                                    onChange={e => {setCurrentEventType(e.target.value); 
                                                    setGameEvent({...gameEvent, type: e.target.value})}}
                                >
                                    <option selected>Выберите тип события</option>
                                    {
                                        eventTypes?.map((type) => (
                                            <option value={type.eventTypeId}>{type.text}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            {getEventComponent()}
                        </div>
                    </div>
                    <div className="row tgh-button-cont">
                        <div className="col m-0 p-0">
                            <div className="row tgh-row">
                                <input name="gameName"
                                    className="input-style input-button"
                                    type="button"
                                    value="Добавить"
                                />

                            </div>
                            <div className="row tgh-row">
                                <input name="gameName"
                                    className="input-style input-button"
                                    type="button"
                                    value="Заверишть матч"
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-4 tgh-info-container">

                </div>
            </div>
        );
    }
}
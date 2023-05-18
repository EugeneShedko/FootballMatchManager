import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./../../../../css/TeamsGames/TeamGameHistory.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GameEventsContainer from "./GameEventsContainer";
import { TO_GAME_CARD, TO_TEAM_GAME_CARD } from "../../../../Utilts/Consts";


export default function FinishTeamGame() {

    const navigate = useNavigate();
    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const [game, setGame] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    /* Типы событий */
    const [eventTypes, setEventTypes] = useState([]);
    const [teams, setTeams] = useState([]);
    /* Попробовать потом все запихать в один объект */
    const [currentEventType, setCurrentEventType] = useState("");
    const [currentTeamId, setCurrentTeamId] = useState();

    /* Массив события для отображения */
    const [gameEventsView, setGameEventsView] = useState([]);
    /* Массив события для сервера */
    const [gameEvents, setGameEvents] = useState([]);
    /*объект для отображения*/
    const [gameEventView, setGameEventView] = useState({
        type: null,
        typeImage: null,
        eventTypeId: null,
        time: null,
        player: null,
        playerImage: null,
        team: null,
        teamId: null,
        entityId1: null,
        entityId1Image: null,
        entityId2: null,
        entityId2Image: null,
    });

    /* Объект для сервера */

    const [teamGameScore, setTeamGameScore] = useState({
        firstTeamGoals: '',
        secodnTeamGoals: ''
    });

    /* Объект для сервера */
    const [gameEvent, setGameEvent] = useState({
        type: null,
        time: null,
        playerId: null,
        teamId: null,
        entityId1: null,
        entityId2: null
    });
    /* Объект, указывающий валидно ли поле */
    const [isValid, setIsValid] = useState({
        team: false,
        time: false,
        type: false,
        player: false,
        entityId1: false,
        entityid2: false,
        button: false,
        firstTeamGoals: false,
        secodnTeamGoals: false
    });
    /* Объект указывающий доступно ли поле */
    const [isDisabled, setIsDisabled] = useState({
        team: true,
        time: false,
        type: false,
        player: false,
        entityId1: false,
        entityId2: false,
        button: false,
        finishButton: false
    });
    /* Объект указывающий посещалось ли поле */
    const [isVisited, setIsVisited] = useState({
        team: false,
        time: false,
        type: false,
        player: false,
        entityId1: false,
        entityId2: false
    });
    /* Объект констант ошибок */
    const errors = {
        team: '\u25CF Данное поле обязательно для заполнения',
        time: '\u25CF Данное поле обязательно для заполнения.',
        type: '\u25CF Данное поле обязательно для заполнения.',
        player: '\u25CF Данное поле обязательно для заполнения.',
        entityId1: '\u25CF Данное поле обязательно для заполнения.',
        entityId2: '\u25CF Данное поле обязательно для заполнения.',
        firstTeamGoals: '\u25CF Счет матча обязателен для заполнения.',
        secodnTeamGoals: '\u25CF Счет матча обязателен для заполнения.'
    }
    /* Объект ошибок полей */
    const [fieldError, setFieldError] = useState({
        team: '',
        time: '',
        type: '',
        player: '',
        entityId1: '',
        entityId2: '',
        firstTeamGoals: '\u25CF Счет матча обязателен для заполнения.',
        secodnTeamGoals: '\u25CF Счет матча обязателен для заполнения.'
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

        const team = teams.find((item) => item.teamId === parseInt(currentTeamId));

        switch (currentEventType) {
            case "goal": return <PlayerForm teamUsers={team.users} />;
            case "assist": return <PlayerForm teamUsers={team.users} />;
            case "yellowcard": return <PlayerForm teamUsers={team.users} />;
            case "redcard": return <PlayerForm teamUsers={team.users} />;
            case "penalty": return <PlayerForm teamUsers={team.users} />;
            case "freekick": return <PlayerForm teamUsers={team.users} />;
            case "corner": return <PlayerForm teamUsers={team.users} />;
            case "change": return <ChangeForm teamUsers={team.users} />;
            default: return null;
        }
    }

    // --------------------------------------------------------------- //
    // ------------------- Поле ввода игрока ------------------------- //

    function PlayerForm(props) {
        return (
            <div className="row tgh-row">
                {(isVisited.player && fieldError.player) && <div className="error-msg">{fieldError.player}</div>}
                <select name="player"
                    className="input-style"
                    disabled={!isDisabled.player}
                    value={gameEvent.playerId}
                    onBlur={e => blurHandler(e)}
                    onChange={e => playerFieldHandler(e)}
                >
                    <option value="-1" selected> Выберите игрока </option>
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
    // -------------------- Поле ввода замены ------------------------ //
    function ChangeForm(props) {
        return (
            <>
                <div className="row tgh-row">
                    {(isVisited.entityId1 && fieldError.entityId1) && <div className="error-msg">{fieldError.entityId1}</div>}
                    <select name="entityId1"
                        className="input-style"
                        value={gameEvent.entityId1}
                        disabled={!isDisabled.entityId1}
                        onChange={e => changeFieldHandler(e)}
                        onBlur={e => blurHandler(e)}
                    >
                        <option value="-1" selected> Игрок на замену </option>
                        {
                            props.teamUsers?.map((user) => (
                                <option value={user.pkId}>{user.firstName + ' ' + user.lastName}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="row tgh-row">
                    {(isVisited.entityId2 && fieldError.entityId2) && <div className="error-msg">{fieldError.entityId2}</div>}
                    <select name="entityId2"
                        className="input-style"
                        value={gameEvent.entityId2}
                        disabled={!isDisabled.entityId2}
                        onChange={e => changeFieldHandler(e)}
                        onBlur={e => blurHandler(e)}
                    >
                        <option value="-1" selected> Игрок с замены </option>
                        {
                            props.teamUsers?.map((user) => (
                                <option value={user.pkId}>{user.firstName + ' ' + user.lastName}</option>
                            ))
                        }
                    </select>
                </div>
            </>
        );
    }

    //-------------------- Обработчик валидности полей события  --------------- //

    useEffect(() => {

        const isDisabledTemp = {
            team: isDisabled.team,
            time: isDisabled.time,
            type: isDisabled.type,
            player: isDisabled.player,
            entityId1: isDisabled.entityId1,
            entityId2: isDisabled.entityId2,
            button: isDisabled.button,
            finishButton: isDisabled.finishButton
        };

        if (isValid.team)
            isDisabledTemp.time = true;
        else
            isDisabledTemp.time = false;

        if (isValid.time && isDisabledTemp.time)
            isDisabledTemp.type = true;
        else
            isDisabledTemp.type = false;

        if (isValid.type && isDisabledTemp.type) {
            isDisabledTemp.entityId1 = true;
            isDisabledTemp.entityId2 = true;
            isDisabledTemp.player = true;
        }
        else {
            isDisabledTemp.entityId1 = false;
            isDisabledTemp.entityId2 = false;
            isDisabledTemp.player = false;
        }


        switch (currentEventType) {

            case "goal": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "assist": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "yellowcard": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "redcard": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "penalty": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "freekick": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "corner": isDisabledTemp.button = isValid.player && isDisabledTemp.player ? true : false; break;
            case "change": isDisabledTemp.button = (isValid.entityId1 && isDisabledTemp.entityId1) && (isValid.entityId2 && isDisabledTemp.entityId2); break;
            default: isDisabledTemp.button = false;
        }

        if (isValid.firstTeamGoals && isValid.secodnTeamGoals)
            isDisabledTemp.finishButton = true;
        else
            isDisabledTemp.finishButton = false;            

        setIsDisabled({
            ...isDisabled, time: isDisabledTemp.time,
            type: isDisabledTemp.type,
            player: isDisabledTemp.player,
            entityId1: isDisabledTemp.entityId1,
            entityId2: isDisabledTemp.entityId2,
            button: isDisabledTemp.button,
            finishButton: isDisabledTemp.finishButton
        });


    }, [isValid])

    // ------------------- Обработчики полей ввода -------------------- //

    /* Сбрасываю игрока при переключении комады, так как хранился игрок другой команды */
    /* И он подтяшивался при следующем изменении*/

    function teamFieldHandler(event) {
        if (event.target.value === null || event.target.value === '-1') {
            setIsValid({ ...isValid, team: false });
            setGameEvent({
                ...gameEvent,
                teamId: '-1',
                playerId: '-1',
                entityId1: '-1',
                entityId2: '-1'
            });
            setFieldError({ ...fieldError, team: errors.team });
            return;
        }

        setCurrentTeamId(event.target.value);
        setGameEvent({
            ...gameEvent, teamId: event.target.value,
            playerId: '-1',
            entityId1: '-1',
            entityId2: '-1'
        });
        setIsValid({ ...isValid, team: true });
        setFieldError({ ...fieldError, team: '' });

        /* Формирую объект View */
        /* Можно было бы вычитывать команду, как в игроке и не нужно было бы условие */
        if (game.firstTeam.pkId === parseInt(event.target.value))
            setGameEventView({
                ...gameEventView, team: game.firstTeam.name,
                teamId: game.firstTeam.pkId
            });
        else
            setGameEventView({
                ...gameEventView, team: game.secondTeam.name,
                teamId: game.secondTeam.pkId
            });
    }

    function timeFieldHandler(event) {

        if (event.target.value === null || event.target.value === '') {
            setIsValid({ ...isValid, time: false });
            setFieldError({ ...fieldError, time: errors.time });
            setGameEvent({ ...gameEvent, time: event.target.value });
            return;
        }
        setGameEvent({ ...gameEvent, time: event.target.value });
        setIsValid({ ...isValid, time: true })
        setFieldError({ ...fieldError, time: '' });

        /* Формирую объект view */
        setGameEventView({ ...gameEventView, time: event.target.value });
    }

    function typeFieldHandler(event) {
        if (event.target.value === null || event.target.value === '-1') {
            setIsValid({ ...isValid, type: false });
            setFieldError({ ...fieldError, type: errors.type });
            setGameEvent({ ...gameEvent, type: event.target.value });
            return;
        }
        setCurrentEventType(event.target.value);
        setGameEvent({ ...gameEvent, type: event.target.value });
        setIsValid({ ...isValid, type: true });
        setFieldError({ ...fieldError, type: '' });

        /* Формирую объект view */
        const typeName = eventTypes.find((type) => type.eventTypeId === event.target.value);
        if (typeName !== undefined) {
            setGameEventView({
                ...gameEventView, type: typeName.text,
                typeImage: typeName.image,
                eventTypeId: typeName.eventTypeId
            });
        }
    }

    function playerFieldHandler(event) {
        if (event.target.value === null || event.target.value === '-1') {
            setIsValid({ ...isValid, player: false });
            setGameEvent({ ...gameEvent, playerId: event.target.value });
            setFieldError({ ...fieldError, player: errors.player });
            return;
        }
        setGameEvent({ ...gameEvent, playerId: event.target.value });
        setIsValid({ ...isValid, player: true });
        setFieldError({ ...fieldError, player: '' });

        /* Формирую объект View */
        const team = teams.find((team) => team.teamId === parseInt(gameEvent.teamId));
        if (team === undefined) { return; }

        const player = team.users.find((user) => user.pkId === parseInt(event.target.value));
        if (player === undefined) { return; }

        setGameEventView({
            ...gameEventView, player: player.firstName + ' ' + player.lastName,
            playerImage: player.image
        });

    }

    function changeFieldHandler(event) {
        if (event.target.value === null || event.target.value === '-1') {
            setIsValid({ ...isValid, [event.target.name]: false });
            setGameEvent({ ...gameEvent, [event.target.name]: event.target.value });
            setFieldError({ ...fieldError, [event.target.name]: errors.entityId1 });
            return;
        }
        setGameEvent({ ...gameEvent, [event.target.name]: event.target.value });
        setIsValid({ ...isValid, [event.target.name]: true });
        setFieldError({ ...fieldError, [event.target.name]: '' });


        /* Формирую объект View */
        const team = teams.find((team) => team.teamId === parseInt(gameEvent.teamId));
        if (team === undefined) { return; }

        const player = team.users.find((user) => user.pkId === parseInt(event.target.value));
        if (player === undefined) { return; }

        setGameEventView({
            ...gameEventView, [event.target.name]: player.firstName + ' ' + player.lastName,
            [event.target.name + 'Image']: player.image
        });
    }

    function scoreFieldHandler(event) {

        setTeamGameScore({ ...teamGameScore, [event.target.name]: event.target.value });

        if (event.target.value === null || event.target.value === '') {
            setIsValid({ ...isValid, [event.target.name]: false });
            setFieldError({ ...fieldError, [event.target.name]: errors.firstTeamGoals });
            return;
        }

        setIsValid({ ...isValid, [event.target.name]: true });
        setFieldError({ ...fieldError, [event.target.name]: '' });
    }

    // ------- Устанавливает, было ли посещено поле ввода ------- //

    const blurHandler = (e) => {
        switch (e.target.name) {
            case 'team': setIsVisited({ ...isVisited, team: true }); break;
            case 'time': setIsVisited({ ...isVisited, time: true }); break;
            case 'type': setIsVisited({ ...isVisited, type: true }); break;
            case 'player': setIsVisited({ ...isVisited, player: true }); break;
            case 'entityId1': setIsVisited({ ...isVisited, entityId1: true }); break;
            case 'entityId2': setIsVisited({ ...isVisited, entityId2: true }); break;
        }
    }

    // -----------------  Добавить событие -------------------- //

    function addTeamGameEvent() {
        //setGameEvents((prev) => [...prev, gameEvent]);

        setGameEvents([...gameEvents, gameEvent]);
        setGameEventsView([...gameEventsView, gameEventView]);

        /* Скидываю объект события */
        setGameEvent({
            type: '-1',
            time: '',
            playerId: '-1',
            teamId: '-1',
            entityId1: '-1',
            entityId2: '-1'
        });


        /* Скидываю валидность */
        setIsValid({
            team: false,
            time: false,
            type: false,
            player: false,
            entityId1: false,
            entityid2: false,
            button: false,
            firstTeamGoals: isValid.firstTeamGoals ? true : false,
            secodnTeamGoals: isValid.secodnTeamGoals ? true : false
        });
        /* Скидываю доступность */
        setIsDisabled({
            team: true,
            time: false,
            type: false,
            player: false,
            entityId1: false,
            entityId2: false,
            button: false
        });

    }

    // ------------------ Заврешить матч -------------------------- //

    function finishGame() {

        const data = {
            GameId: gameId,
            FirstTeamGoals: parseInt(teamGameScore.firstTeamGoals),
            SecondTeamGoals: parseInt(teamGameScore.secodnTeamGoals),
            GameEvents: gameEvents
        }

        axios.post('http://localhost:5004/api/gameevent/finish-team-game', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
                navigate(TO_TEAM_GAME_CARD + '/' + gameId);
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error("Ошибка создания матча",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }

    // -------------------- Отменить завершение матча ---------------------------- //

    function cancelFinish()
    {
        navigate(TO_TEAM_GAME_CARD + '/' + gameId);
    }


    // ------------------- Удлаяет событие из списка событий ------------------------- //

    function deleteTeamGameEvent(delind)
    {  
        const view = [...gameEventsView];
        const server = [...gameEvents];
        view.sort((event1, event2) => parseInt(event1.time) - parseInt(event2.time)).splice(delind, 1);
        server.sort((event1, event2) => parseInt(event1.time) - parseInt(event2.time)).splice(delind, 1);
        setGameEventsView(view);
        setGameEvents(server);
    }

    // --------------------------------------------------------------- //
    
    if (isLoading) {
        return (
            <div className="row tgh-info-main-container">
                <div className="col-4 tgh-info-container">
                    <div className="row tgh-game-score">
                        <div className="col m-0 p-0">
                            <div className="row tgh-title">
                                Счет матча
                            </div>
                            <div className="row m-0 p-0">
                                <div className="col-5 tgh-team-score-cont">
                                    <div className="row m-0 p-0">
                                        {game.firstTeam.name}
                                    </div>
                                </div>
                                <div className="col-2 m-0 p-0" />
                                <div className="col-5 tgh-team-score-cont">
                                    <div className="row m-0 p-0">
                                        {game.secondTeam.name}
                                    </div>
                                </div>
                            </div>
                            <div className="row m-0 p-0">
                                <div className="col-5 m-0 p-0">
                                    <div className="row tgh-row">
                                        <input name="firstTeamGoals"
                                            className="input-style"
                                            type="text"
                                            placeholder="Голов"
                                            value={teamGameScore.firstTeamGoals}
                                            onChange={e => scoreFieldHandler(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-2 tgh-score-scop">
                                    <div className="row tgh-row">
                                        -
                                    </div>
                                </div>
                                <div className="col-5 m-0 p-0">
                                    <div className="row tgh-row">
                                        <input name="secodnTeamGoals"
                                            className="input-style"
                                            type="text"
                                            placeholder="Голов"
                                            value={teamGameScore.secodnTeamGoals}
                                            onChange={e => scoreFieldHandler(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {(fieldError.firstTeamGoals || fieldError.secodnTeamGoals) && <div className="error-msg">{errors.firstTeamGoals}</div>}
                        </div>
                    </div>
                    <div className="row tgh-info-cont">
                        <div className="col m-0 p-0">
                            <div className="row tgh-title">
                                Хронология
                            </div>
                            <div className="row tgh-row">
                                {(isVisited.team && fieldError.team) && <div className="error-msg">{fieldError.team}</div>}
                                <select name="team"
                                    className="input-style"
                                    value={gameEvent.teamId}
                                    disabled={!isDisabled.team}
                                    onChange={e => teamFieldHandler(e)}
                                    onBlur={e => blurHandler(e)}
                                >
                                    <option value="-1" selected>Выберите команду</option>
                                    <option value={game.firstTeam.pkId} >{game.firstTeam.name}</option>
                                    <option value={game.secondTeam.pkId}>{game.secondTeam.name}</option>
                                </select>
                            </div>
                            <div className="row tgh-row">
                                {(isVisited.time && fieldError.time) && <div className="error-msg">{fieldError.time}</div>}
                                <input name="time"
                                    className="input-style"
                                    type="text"
                                    placeholder="Введите минуту события"
                                    value={gameEvent.time}
                                    disabled={!isDisabled.time}
                                    onChange={e => timeFieldHandler(e)}
                                    onBlur={e => blurHandler(e)}
                                />
                            </div>
                            <div className="row tgh-row">
                                {(isVisited.type && fieldError.type) && <div className="error-msg">{fieldError.type}</div>}
                                <select name="type"
                                    className="input-style"
                                    disabled={!isDisabled.type}
                                    value={gameEvent.type}
                                    onChange={e => typeFieldHandler(e)}
                                    onBlur={e => blurHandler(e)}
                                >
                                    <option value="-1" selected>Выберите тип события</option>
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
                                    disabled={!isDisabled.button}
                                    onClick={addTeamGameEvent}
                                />

                            </div>
                            <div className="row tgh-row">
                                <input name="gameName"
                                    className="input-style input-button"
                                    type="button"
                                    value="Заверишть матч"
                                    disabled={!isDisabled.finishButton}
                                    onClick={finishGame}
                                />
                            </div>
                            <div className="row tgh-row">
                                <input name="gameName"
                                    className="input-style input-button"
                                    type="button"
                                    value="Оменить завершение"
                                    onClick={cancelFinish}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 tgh-event-cont">
                    <GameEventsContainer mode="create"
                        teamId={game.firstTeam.pkId}
                        events={gameEventsView} 
                        deleteTeamGameEvent={deleteTeamGameEvent}
                        />
                </div>
            </div>
        );
    }
}
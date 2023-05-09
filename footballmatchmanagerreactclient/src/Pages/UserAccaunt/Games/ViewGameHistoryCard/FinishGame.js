import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./../../../../css/TeamsGames/TeamGameHistory.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GameEventsContainer from "./../../TeamGames/ViewTeamGameInfoCard/GameEventsContainer";
import { TO_GAME_CARD, TO_TEAM_GAME_CARD } from "../../../../Utilts/Consts";


export default function FinishGame() {

    const navigate = useNavigate();
    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const [isLoading, setIsLoading] = useState(false);
    /* Игроки матча */
    const [gameUsers, setGameUsers] = useState([]);
    /* Типы событий */
    const [eventTypes, setEventTypes] = useState([]);
    /* Попробовать потом все запихать в один объект */
    const [currentEventType, setCurrentEventType] = useState("");
    /* Массив событий для отображения */
    const [gameEventsView, setGameEventsView] = useState([]);
    /* Массив событий для сервера */
    const [gameEvents, setGameEvents] = useState([]);
    /*объект для отображения*/
    const [gameEventView, setGameEventView] = useState({
        type: null,
        typeImage: null,
        eventTypeId: null,
        player: null,
        playerImage: null,
        entityId1: null,
        entityId1Image: null,
        entityId2: null,
        entityId2Image: null,
        time: '',
        team: '',
        gameType: 'game'
    });

    /* Объект для сервера */
    /* Не убираю время и команду, так как хочу передать через одну модель на сервере */
    const [gameEvent, setGameEvent] = useState({
        type: '-1',
        time: '0',
        playerId: '-1',
        teamId: '-1',
        entityId1: '-1',
        entityId2: '-1'
    });
    /* Объект, указывающий валидно ли поле */
    const [isValid, setIsValid] = useState({
        type: false,
        player: false,
        entityId1: false,
        entityid2: false,
        button: false,
    });
    /* Объект указывающий доступно ли поле */
    const [isDisabled, setIsDisabled] = useState({
        type: true,
        player: false,
        entityId1: false,
        entityId2: false,
        button: false,
    });
    /* Объект указывающий посещалось ли поле */
    const [isVisited, setIsVisited] = useState({
        type: false,
        player: false,
        entityId1: false,
        entityId2: false
    });
    /* Объект констант ошибок */
    const errors = {
        type: '\u25CF Данное поле обязательно для заполнения.',
        player: '\u25CF Данное поле обязательно для заполнения.',
        entityId1: '\u25CF Данное поле обязательно для заполнения.',
        entityId2: '\u25CF Данное поле обязательно для заполнения.'
    }
    /* Объект ошибок полей */
    const [fieldError, setFieldError] = useState({
        type: '',
        player: '',
        entityId1: '',
        entityId2: ''
    });

    // --------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/profile/game-users/' + gameId, { withCredentials: true })
            .then((response) => {
                //Переменная состояния!
                setGameUsers(response.data);
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
                setIsLoading(true);
            })
            .catch(userError => {
                if (userError.response) {
                    setIsLoading(false);
                    toast.error(userError.response.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

    }, []);

    // ------------ Возвращает форму выбора события в зависимости от типа события -------------------- //

    function getEventComponent() {

        /* Добавить игроков участников матча */

        switch (currentEventType) {
            case "goal": return <PlayerForm />;
            case "assist": return <PlayerForm />;
            case "yellowcard": return <PlayerForm />;
            case "redcard": return <PlayerForm />;
            case "penalty": return <PlayerForm />;
            case "freekick": return <PlayerForm />;
            case "corner": return <PlayerForm />;
            case "change": return <ChangeForm />;
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
                    {/* Здесь должен быть список пользователей и передавать не через пропсы!!! */}
                    <option value="-1" selected> Выберите игрока </option>
                    {
                        gameUsers?.map((user) => (
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
                        {/* Здесь должен быть список пользователей и передавать не через пропсы!!! */}
                        <option value="-1" selected> Игрок на замену </option>
                        {
                            gameUsers?.map((user) => (
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
                            gameUsers?.map((user) => (
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
            type: isDisabled.type,
            player: isDisabled.player,
            entityId1: isDisabled.entityId1,
            entityId2: isDisabled.entityId2,
            button: isDisabled.button,
            finishButton: isDisabled.finishButton
        };

        if (isValid.type) {
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

        setIsDisabled({
            ...isDisabled,
            type: isDisabledTemp.type,
            player: isDisabledTemp.player,
            entityId1: isDisabledTemp.entityId1,
            entityId2: isDisabledTemp.entityId2,
            button: isDisabledTemp.button,
        });


    }, [isValid])

    // ------------------- Обработчики полей ввода -------------------- //

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

        const player = gameUsers.find((user) => user.pkId === parseInt(event.target.value));
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

        const player = gameUsers.find((user) => user.pkId === parseInt(event.target.value));
        if (player === undefined) { return; }

        setGameEventView({
            ...gameEventView, [event.target.name]: player.firstName + ' ' + player.lastName,
            [event.target.name + 'Image']: player.image
        });

    }

    // ------- Устанавливает, было ли посещено поле ввода ------- //

    const blurHandler = (e) => {
        switch (e.target.name) {
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
        /* Оставил поля, так как хочу передавать через одну модель на сервере */
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
            type: false,
            player: false,
            entityId1: false,
            entityid2: false,
            button: false,
        });
        /* Скидываю доступность */
        setIsDisabled({
            type: true,
            player: false,
            entityId1: false,
            entityId2: false,
            button: false
        });

    }

    // ------------------ Заврешить матч -------------------------- //

    function finishGame() {

        /* Не убираю счет матча, так как хочу передать значение через одну модель на сервере */
        const data = {
            GameId: gameId,
            FirstTeamGoals: 0,
            SecondTeamGoals: 0,
            GameEvents: gameEvents
        }

        console.log('DATA');
        console.log(data);

        axios.post('http://localhost:5004/api/gameevent/finish-game', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
                navigate(TO_GAME_CARD + '/' + gameId);
            })
            .catch(userError => {
                if (userError.response) {
                }
            });
    }

    // -------------------- Отменить завершение матча ---------------------------- //

    function cancelFinish() {
        navigate(TO_GAME_CARD + '/' + gameId);
    }


    // ------------------- Удлаяет событие из списка событий ------------------------- //

    function deleteTeamGameEvent(delind) {
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
                    <div className="row gh-info-cont">
                        <div className="col m-0 p-0">
                            <div className="row tgh-title">
                                Хронология
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
                        <div className="col gh-button-cont">
                            <div className="row gh-row">
                                <input name="gameName"
                                    className="input-style input-button"
                                    type="button"
                                    value="Добавить"
                                    disabled={!isDisabled.button}
                                    onClick={addTeamGameEvent}
                                />

                            </div>
                            <div className="row gh-row">
                                <input name="gameName"
                                    className="input-style input-button"
                                    type="button"
                                    value="Заверишть матч"
                                    onClick={finishGame}
                                />
                            </div>
                            <div className="row gh-row">
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
                <div className="col-3 tgh-event-cont">
                    <GameEventsContainer mode="create"
                        events={gameEventsView}
                        deleteTeamGameEvent={deleteTeamGameEvent}
                    />
                </div>
            </div>
        );
    }
}
import { useContext, useEffect, useState } from "react";
import Players from "../../Players/ViewPlayers/Players";
import "./../../../../css/GameInvite/GameInvite.css";
import axios from "axios";
import PlayerGenerator from "../../Players/ViewPlayers/PlayerGenerator";
import { useNavigate, useParams } from "react-router-dom";
import { TO_GAME_CARD } from "../../../../Utilts/Consts";
import { Context } from "../../../..";

export default function InviteCard() {

    const { userContext } = useContext(Context);
    const navigate = useNavigate();
    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const [searchString, setSearchString] = useState("");
    /* Первоначальный список игроков */
    const [initPlayers, setInitPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    /* Список позиций */
    const [positions, setPositions] = useState([]);
    /* Объект фильтрации */
    const [filter, setFilter] = useState({
        position: '',
        goals: 0,
        assists: 0
    });
    /* Массив игроков, кому отправлены приглашения */
    const [notifiUser, setNotifiUser] = useState([]);

    // ------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/profile/invit-users/' + gameId, { withCredentials: true })
            .then((response) => {
                setInitPlayers(response.data);
                setPlayers(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                }
            });

        axios.get('http://localhost:5004/api/profile/player-position', { withCredentials: true })
            .then((response) => {
                setPositions(response.data);
            })
            .catch(userError => {
                if (userError.response) { }
            });

        axios.get('http://localhost:5004/api/notification/sent-invit/' + gameId, { withCredentials: true })
            .then((response) => {
                setNotifiUser(response.data);
            })
            .catch(userError => {
                if (userError.response) { }
            });


    }, []);

    // ------------------------------------------------- //

    function cancelInvite() {
        navigate(TO_GAME_CARD + '/' + gameId);
    }

    // -------------- Фильтрация игроков  ------------ //

    useEffect(() => {

        var filterPlayers = [];
        filterPlayers = initPlayers.filter(player => {
            return String(player.position).toLowerCase().includes(filter.position.toLowerCase().trim());
        })

        filterPlayers = filterPlayers.filter(player => player.goalsQnt >= filter.goals);

        filterPlayers = filterPlayers.filter(player => player.assistsQnt >= filter.assists);

        setPlayers(filterPlayers);


    }, [filter])


    // -------------- Сброс фильтрации ---------------- //

    function resetFilter() {

        setFilter({
            position: '',
            goals: 0,
            assists: 0
        })
    }

    // ----------------- Приглашение к участию --------------- //

    function sendInviteToAddGame(id) {

        var conn = userContext.notificonn;
        conn.invoke("InvitationToGame", parseInt(id), gameId);
        setNotifiUser([...notifiUser, {fkRecipient: parseInt(id)}]);

    }

    // ------------------------------------------------- //

    return (
        <div className="row mi-info-main-container">
            <div className="col-11 mi-info-container">
                <div className="row mi-top-cont">
                    <div className="col-3 mi-top-col mi-search-cont">
                        <input className="search-player-element"
                            type="text"
                            placeholder="Введите имя игрока"
                            value={searchString}
                            onChange={e => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="col-3 mi-top-col">
                        <select className="filter-player-element"
                            onChange={(e) => {
                                setFilter({ ...filter, position: e.target.value })
                            }}
                        >
                            <option selected value=""> Позиция </option>
                            {
                                positions?.map((position) => (
                                    <option>{position.strValue}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-2 mi-top-col">
                        <div className="row filter-text">
                            Мин. голов {filter.goals}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                                value={filter.goals}
                                onChange={(e) => {
                                    setFilter({ ...filter, goals: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-2 mi-top-col">
                        <div className="row filter-text">
                            Мин. передач {filter.assists}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                                value={filter.assists}
                                onChange={(e) => {
                                    setFilter({ ...filter, assists: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-2 mi-top-col reset-button-cont">
                        <input className="reset-button"
                            type="button"
                            value="Сбросить"
                            onClick={resetFilter}
                        />
                    </div>
                </div>
                <div className="row mi-user-container">
                    <PlayerGenerator players={players}
                                     searchString={searchString}
                                     notifiUser={notifiUser}
                                     sendInviteToAddGame={sendInviteToAddGame}
                                     />
                </div>
                <div className="row mi-button-cont">
                    <input className="cancel-button"
                        type="button"
                        value="Отмена"
                        onClick={cancelInvite}
                    />
                </div>
            </div>
        </div>
    )
}
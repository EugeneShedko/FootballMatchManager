import { useContext, useEffect, useState } from "react";
import PlayerGenerator from "./PlayerGenerator";
import axios from "axios";
import { useLocation } from "react-router-dom";

import "./../../../../css/PlayersPage.css";
import { Context } from "../../../..";

export default function Players() {

    const { userContext } = useContext(Context);
    const location = useLocation();
    const isRefreshed = location.state && location.state.refresh;
    const [initPlayers, setInitPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [searchString, setSearchString] = useState("");
    /* Статусы пользователья */
    const [currentPlayersStatus, setCurrentPlayersStatus] = useState('active');

    // ------------------------------------------------------------------------------------------- //

    useEffect(
        () => {

            getPlayersByStatus();

        }, [currentPlayersStatus]);

    // --------------------------------------------------------------------------------------- //

    function getPlayersByStatus() 
    {

        let path = "";
        if(userContext.isAuth)
           path = 'http://localhost:5004/api/profile/all-players';
        
        if(userContext.isAdmin)
           path = 'http://localhost:5004/api/profile/all-players/' + currentPlayersStatus;   

        axios.get(path, { withCredentials: true })
            .then((response) => {
                setInitPlayers(response.data);
                setPlayers(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                }
            });
    }

    // --------------------------------------------------------------------------------------- //

    function filter() {
        var resultPlayers = [];
        var tempPlayers = [];
        var checkList = document.getElementsByName("uallplayers");

        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i].checked) {
                tempPlayers = initPlayers.filter(player => {
                    return String(player.position).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultPlayers = resultPlayers.concat(tempPlayers);
            }
        }

        setPlayers(resultPlayers);
    }

    // --------------------------------------------------------------------------------------- //

    function reset() {
        setPlayers(initPlayers);
        var checkList = document.getElementsByName("uallplayers");
        for (var i = 0; i < checkList.length; i++) {
            checkList[i].checked = false;
        }
    }

    // --------------------------------------------------------------------------------------- //

    return (
        <div className="row ppplayers-main-container">
            <div className="col-9 ppplayers-container">
                <PlayerGenerator players={players}
                    searchString={searchString}
                />
            </div>
            <div className="col-3 pplefcol">
                <div className="pp-fixed-container">
                    {userContext.isAdmin ?
                        <div className="row pplcrow">
                            <select className="mp-select-style"
                                onChange={(event) => setCurrentPlayersStatus(event.target.value)}
                            >
                                <option value='active' selected >Активный</option>
                                <option value='block'>Блокирован на время</option>
                                <option value='delete'>Блокирован навсегда</option>
                            </select>
                        </div>
                        : null}
                    <div className="row pplcrow">
                        <input id="search-player-element" value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                            type="text"
                            placeholder="Введите имя игрока" />
                    </div>
                    <div className="row filter-player-container">
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Нападающий" />
                            НП
                        </label>
                        <label>

                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Левый полузащитник" />
                            ЛПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Правый полузащитник" />
                            ППЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Атакующий полузащитник" />
                            АПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Центральный полузащитник" />
                            ЦПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Опорный полузащитник" />
                            ОПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Левый защитник" />
                            ЛЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Правый защитник" />
                            ПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Центральный защитник" />
                            ЦЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallplayers" value="Вратарь" />
                            В
                        </label>
                        <input className="ppbutton-style"
                            type="button"
                            value="Применить"
                            onClick={filter} />
                        <input className="ppbutton-style"
                            type="button"
                            value="Сбросить"
                            onClick={reset} />
                    </div>
                </div>
            </div>
        </div>
    );
}  
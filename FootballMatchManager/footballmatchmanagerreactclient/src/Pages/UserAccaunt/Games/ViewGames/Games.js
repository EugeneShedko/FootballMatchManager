import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GameGenerator from "./GameGenerator";

import "./../../../../css/Games.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TO_CREATE_GAME } from "../../../../Utilts/Consts";
import { Context } from "../../../..";

export default function Matches() {

    /* ----------------------------------------------------------------------- */

    const { userContext } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const isRefreshed = location.state && location.state.refresh;
    const [initGames, setInitGames] = useState([]);
    const [games, setGames] = useState([]);
    const [searchString, setSearchString] = useState("");
    const [currentGameStatus, setCurrentGameStatus] = useState('1')

    /* ----------------------------------------------------------------------- */

    useEffect(
        () => {

            getGamesByStatus();

        }, [isRefreshed]
    );

    useEffect(() => {

        getGamesByStatus();

    }, [currentGameStatus])

    /* ----------------------------------------------------------------------- */

    function getGamesByStatus() {

        axios.get('http://localhost:5004/api/profile/get-all-games/' + currentGameStatus, { withCredentials: true })
            .then((response) => {
                setGames(response.data);
                setInitGames(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log("Ошибка получения матчей");
                    console.log(userError.response.data.message);
                }
            });;
    }

    /* ----------------------------------------------------------------------- */

    function filter() {
        var resultGames = [];
        var tempGames = [];
        var checkList = document.getElementsByName("uallmatch");

        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i].checked) {
                tempGames = initGames.filter(game => {
                    return String(game.format).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultGames = resultGames.concat(tempGames);
            }
        }

        setGames(resultGames);
    }

    /* ----------------------------------------------------------------------- */

    function reset() {
        setGames(initGames);
        var checkList = document.getElementsByName("uallmatch");
        for (var i = 0; i < checkList.length; i++) {
            checkList[i].checked = false;
        }
    }

    /* ----------------------------------------------------------------------- */

    return (
        <div className="row mpmatches-main-container">
            <div className="col-9 mpmatches-container">
                <GameGenerator games={games}
                    setGames={setGames}
                    searchString={searchString}
                />
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        {/* !Плохо, что здесь кнстантами задаю */}
                        <select className="mp-select-style"
                            onChange={(event) => setCurrentGameStatus(event.target.value)}
                        >
                            <option value='1' selected >В ожидании</option>
                            {userContext.isAdmin ?
                                <option value='2'>Окончен</option>
                                : null}
                            <option value='3'>Завершен</option>
                        </select>
                    </div>
                    {userContext.isAuth ?
                        <div className="row mplcrow">
                            <input className="mpbutton-style"
                                type="button"
                                value="Создать матч"
                                onClick={() => navigate(TO_CREATE_GAME)}
                            />
                        </div>
                        : null}
                    <div className="row mplcrow">
                        <input id="search-match-element"
                            type="text"
                            placeholder="Введите название матча"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="row filter-match-container">
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallmatch" value="5x5" />
                            5x5
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallmatch" value="9x9" />
                            9x9
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uallmatch" value="11x11" />
                            11x11
                        </label>
                        <input className="mpbutton-style"
                            type="button"
                            value="Применить"
                            onClick={filter} />
                        <input className="mpbutton-style"
                            type="button"
                            value="Сбросить"
                            onClick={reset} />
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}
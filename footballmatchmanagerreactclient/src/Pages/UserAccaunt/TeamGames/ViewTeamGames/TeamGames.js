import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TeamGameGenerator from "./TeamGamesGenerator";

import "./../../../../css/TeamsGames/Teams.css"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TO_CREATE_GAME, TO_CREATE_TEAM_GAME } from "../../../../Utilts/Consts";

export default function TeamGames(props) {

    /* ----------------------------------------------------------------------- */

    const navigate = useNavigate();
    const location = useLocation();
    const isRefreshed = location.state && location.state.refresh;
    const [initGames, setInitGames] = useState([]);
    const [games, setGames] = useState([]);
    const [searchString, setSearchString] = useState("");
    const [isLoad, setIsLoad] = useState(false);

    /* ----------------------------------------------------------------------- */

    useEffect(
        () => {
            axios.get('http://localhost:5004/api/teamgame/' + props.req, { withCredentials: true })
                .then((response) => {
                    setGames(response.data);
                    setInitGames(response.data);
                    setIsLoad(true);
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
            ;
        }, [isRefreshed]
    );

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

    if (isLoad) {
        return (
            <div className="row teams-main-container">
                <div className="col-9 teams-container">
                    <TeamGameGenerator games={games}
                        setGames={setGames}
                        searchString={searchString}
                    />
                </div>
                <div className="col-3 tmlefcol">
                    <div className="tm-fixed-container">
                        <div className="row tmlcrow">
                            <input className="tmbutton-style" type="button" value="Создать матч" onClick={() => navigate(TO_CREATE_TEAM_GAME)} />
                        </div>
                        <div className="row tmlcrow">
                            <input id="search-team-element"
                                type="text"
                                placeholder="Введите название матча"
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                        </div>
                        <div className="row filter-team-container">
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
}
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../index"
import GameGenerator from "./ViewGames/GameGenerator";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";


export default function UserMatchesPr() {

    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState(parseInt(useParams().id));
    const { userContext } = useContext(Context);

    const [initUserMatchesParticipant, setInitUserMatchesParticipant] = useState([]);
    const [userMatchPr, setUserMatchPr] = useState([]);
    const [searchString, setSearchString] = useState("");
    const [currentGameStatus, setCurrentGameStatus] = useState('1')

    // ------------------------------------------------------------------------------------------------------ //

    useEffect(() => {

        getUserPartGamesByStatus();

        /* Плохо сделано обновление */
    }, [location.state && location.state.refresh, currentGameStatus]);

    // ------------------------------------------------------------------------------------------------------ //

    function getUserPartGamesByStatus() 
    {
        axios.get('http://localhost:5004/api/profile/user-part-game/' + userId + '/' + currentGameStatus, { withCredentials: true })
            .then((response) => {
                setUserMatchPr(response.data);
                setInitUserMatchesParticipant(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log("Ошибка получения матчей");
                }
            });
    }

    // ------------------------------------------------------------------------------------------------------ //

    function filter() {
        var resultGames = [];
        var tempGames = [];
        var checkList = document.getElementsByName("uAllMatchesParticipant");

        for (var i = 0; i < checkList.length; i++) {
            if (checkList[i].checked) {
                tempGames = initUserMatchesParticipant.filter(game => {
                    return String(game.format).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultGames = resultGames.concat(tempGames);
            }
        }

        if (resultGames.length > 0) {
            setUserMatchPr(resultGames);
        }
    }

    // ------------------------------------------------------------------------------------------------------ //

    function reset() {
        setUserMatchPr(initUserMatchesParticipant);
        var checkList = document.getElementsByName("uAllMatchesParticipant");
        for (var i = 0; i < checkList.length; i++) {
            checkList[i].checked = false;
        }
    }

    // ------------------------------------------------------------------------------------------------------ //

    return (
        <div className="row mpmatches-main-container">
            <div className="col-9 mpmatches-container">
                <GameGenerator games={userMatchPr}
                    searchString={searchString}
                />
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        <select className="mp-select-style"
                            onChange={(event) => setCurrentGameStatus(event.target.value)}
                        >
                            <option value='1' selected >В ожидании</option>
                            {userContext.isAdmin || userContext.userId == userId?
                                <option value='2'>Окончен</option>
                                : null}
                            <option value='3'>Завершен</option>
                        </select>
                    </div>
                    <div className="row mplcrow">
                        {userContext.isAuth ?
                            <input className="mpbutton-style"
                                type="button"
                                value="Создать матч"
                                onClick={() => navigate(location.pathname + '/' + "creategame")}
                            />
                            : null}
                    </div>
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
                            <input type="checkbox" className="checkbox-style" name="uAllMatchesParticipant" value="5x5" />
                            5x5
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uAllMatchesParticipant" value="9x9" />
                            9x9
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uAllMatchesParticipant" value="11x11" />
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

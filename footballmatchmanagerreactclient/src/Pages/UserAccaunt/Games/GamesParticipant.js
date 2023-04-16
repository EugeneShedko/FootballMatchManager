import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "./ViewGames/GameBlock";
import {Context} from "../../../index"
import GameGenerator from "./ViewGames/GameGenerator";
import CreateMatch from "./CreateGame";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


export default function UserMatchesPr() {

    const navigate = useNavigate();
    const location = useLocation();
    const {userContext} = useContext(Context);

    const [initUserMatchesParticipant, setInitUserMatchesParticipant] = useState([]);
    const [userMatchPr, setUserMatchPr] = useState([]);
    const [searchString, setSearchString] = useState("");

    // ------------------------------------------------------------------------------------------------------ //

    useEffect(() => {
            const data = new FormData();
            data.append("userId", userContext.userId);

            axios.post('http://localhost:5004/api/profile/user-part-game', data ,{ withCredentials: true })
                .then((response) => {
                    setUserMatchPr(response.data);
                    setInitUserMatchesParticipant(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error("Ошибка получения матчей",
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });
            ;
        /* Плохо сделано обновление */    
        }, [location.state && location.state.refresh]
    );

    // ------------------------------------------------------------------------------------------------------ //

    function filter()
    {
        var resultGames = [];
        var tempGames = [];
        var checkList = document.getElementsByName("uAllMatchesParticipant");

        for(var i = 0; i < checkList.length; i++)
        {
            if(checkList[i].checked)
            {
                tempGames = initUserMatchesParticipant.filter(game => {
                    return String(game.format).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultGames = resultGames.concat(tempGames);
            }
        }

        if(resultGames.length > 0)
        {
            setUserMatchPr(resultGames);
        }
    }

    // ------------------------------------------------------------------------------------------------------ //

    function reset()
    {
        setUserMatchPr(initUserMatchesParticipant);
        var checkList = document.getElementsByName("uAllMatchesParticipant");
        for(var i = 0; i < checkList.length; i++)
        {
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
                    <input className="mpbutton-style" 
                           type="button" 
                           value="Создать матч" 
                           onClick={() => navigate(location.pathname + '/' + "creategame")} 
                           />
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

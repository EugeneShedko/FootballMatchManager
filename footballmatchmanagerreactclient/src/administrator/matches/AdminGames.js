import "./../../css/matchespage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminMatchBlock from "./adminmatchblock";
import AdminGameGenerator from "./AdminGameGenerator";

export default function AdminMatches(props) {

    const [initGames, setInitGames] = useState([]);
    const [games, setGames] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('http://localhost:5000/api/admin/profile/allmatches', { withCredentials: true })
                .then((response) => {
                    setGames(response.data);
                    setInitGames(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.success(userError.response.message,
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });
            ;
        }, []
    );

    function filter()
    {
        var resultGames = [];
        var tempGames = [];
        var checkList = document.getElementsByName("aallmatch");

        for(var i = 0; i < checkList.length; i++)
        {
            if(checkList[i].checked)
            {
                tempGames = initGames.filter(game => {
                    return String(game.gameFormat).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultGames = resultGames.concat(tempGames);
            }
        }

        if(resultGames.length > 0)
        {
            setGames(resultGames);
        }
    }

    function reset()
    {
        setGames(initGames);
        var checkList = document.getElementsByName("aallmatch");
        for(var i = 0; i < checkList.length; i++)
        {
            checkList[i].checked = false;
        }
    }

    return (
        <div className="row mpmatches-main-container">
            <div className="col-9 mpmatches-container">
                <AdminGameGenerator games={games}
                                    searchString={searchString}
                                    setContState={props.setContState}
                                    setMatches={setGames} />
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        <input id="search-match-element" 
                               type="text" 
                               placeholder="Введите название матча" 
                               value={searchString}
                               onChange={(e) => setSearchString(e.target.value)} 
                               />
                    </div>
                    {/*Возможно форматы выводит, сделав запрос, пока что напишу текстом*/}
                    <div className="row filter-match-container">
                        {/*Пока что не знаю, как отфилтровать оставлю только формат*/}
                        {/*
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            Сегодня
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            Завтра
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            9:00 - 12:00
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            12:00 - 15:00
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            15:00 - 18:00
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            18:00 - 21:00
                        </label>
                        */}
                        {/*Пока что не знаю, как сделать фильтрацию*/}
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallmatch" value="5x5" />
                            5x5
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallmatch" value="5x5" />
                            9x9
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallmatch" value="5x5" />
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
        </div>
    );
}  
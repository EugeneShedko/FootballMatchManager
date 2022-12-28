import "./../../css/matchespage.css"
import { useEffect, useState } from "react";
import CreateMatch from "./CreateMatch";
import GameGenerator from "../GameGenerator";
import axios from "axios";
import { toast } from "react-toastify";

export default function Matches(props) {

    const [createMatchVisible, setcreateMatchVisible] = useState(false);
    const [initGames, setInitGames] = useState([]);
    const [games, setGames] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/allmatches', { withCredentials: true })
                .then((response) => {
                    setGames(response.data);
                    setInitGames(response.data);
                    console.log("запрос!!!!!!!!!!!!!!");
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
        }, [props]
    );

    function filter()
    {
        var resultGames = [];
        var tempGames = [];
        var checkList = document.getElementsByName("uallmatch");

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
        var checkList = document.getElementsByName("uallmatch");
        for(var i = 0; i < checkList.length; i++)
        {
            checkList[i].checked = false;
        }
    }

    //Плохо работае наведение на послдений блок матчей(не знаю, почему)
    return (
        <div className="row mpmatches-main-container">
            <div className="col-9 mpmatches-container">
                <GameGenerator games={games}
                               setGames={setGames}
                               searchString={searchString}
                               setContState={props.setContState} />
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        <input className="mpbutton-style" type="button" value="Создать матч" onClick={() => setcreateMatchVisible(true)} />
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
            <CreateMatch show={createMatchVisible} 
                         onHide={setcreateMatchVisible}
                         setAllMatches={setGames}  
            />
        </div>
    );
}
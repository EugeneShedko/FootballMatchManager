import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "../../MatchBlock";
import { Context } from "../../../index"
import GameGenerator from "../../GameGenerator";
import CreateMatch from "../CreateMatch";


export default function UserMatchesCr(props) {

    const { user } = useContext(Context);

    const [createMatchVisible, setcreateMatchVisible] = useState(false);
    const [initUserMatchesCreator, setInitUserMatchesCreator] = useState([]);
    const [userMatchCr, setUserMatchCr] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {

            const data = new FormData();
            data.append("userId", user.getUserId);

            axios.post('http://localhost:5000/api/profile/userCreatMatch', data, { withCredentials: true })
                .then((response) => {
                    setUserMatchCr(response.data);
                    setInitUserMatchesCreator(response.data);
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
        }, [props]
    );

    function filter()
    {
        var resultGames = [];
        var tempGames = [];
        var checkList = document.getElementsByName("uAllMatchesCreator");

        for(var i = 0; i < checkList.length; i++)
        {
            if(checkList[i].checked)
            {
                tempGames = initUserMatchesCreator.filter(game => {
                    return String(game.gameFormat).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultGames = resultGames.concat(tempGames);
            }
        }

        if(resultGames.length > 0)
        {
            setUserMatchCr(resultGames);
        }
    }

    function reset()
    {
        setUserMatchCr(initUserMatchesCreator);
        var checkList = document.getElementsByName("uAllMatchesCreator");
        for(var i = 0; i < checkList.length; i++)
        {
            checkList[i].checked = false;
        }
    }

    return (
        <div className="row mpmatches-main-container">
            <div className="col-9 mpmatches-container">
                <GameGenerator games={userMatchCr}
                    searchString={searchString}
                    setContState={props.setContState} />
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        <input className="mpbutton-style" 
                               type="button" 
                               value="Создать матч" 
                               onClick={() => setcreateMatchVisible(true)} />
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
                            <input type="checkbox" className="checkbox-style" name="uAllMatchesCreator" value="5x5" />
                            5x5
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uAllMatchesCreator" value="9x9" />
                            9x9
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="uAllMatchesCreator" value="11x11"/>
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
            <CreateMatch show   = {createMatchVisible} 
                         onHide = {setcreateMatchVisible} 
            />
        </div>
    );
}

import "./../../css/playerspage.css"
import { useEffect, useState } from "react";
import PlayerGenerator from "../PlayerGenerator";
import axios from "axios";
import { toast } from "react-toastify";

export default function Players(props) {

    const [initPlayers, setInitPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/allplayers', { withCredentials: true })
                .then((response) => {
                    setInitPlayers(response.data);
                    setPlayers(response.data);
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
        var resultPlayers = [];
        var tempPlayers = [];
        var checkList = document.getElementsByName("uallplayers");

        for(var i = 0; i < checkList.length; i++)
        {
            if(checkList[i].checked)
            {
                tempPlayers = initPlayers.filter(player => {
                    return String(player.userPosition).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultPlayers = resultPlayers.concat(tempPlayers);
            }
        }

        if(resultPlayers.length > 0)
        {
            setPlayers(resultPlayers);
        }
    }

    function reset()
    {
        setPlayers(initPlayers);
        var checkList = document.getElementsByName("uallplayers");
        for(var i = 0; i < checkList.length; i++)
        {
            checkList[i].checked = false;
        }
    }

    return (
        <div className="row ppplayers-main-container">
            <div className="col-9 ppplayers-container">
                <PlayerGenerator players={players}
                                 searchString={searchString}
                                 setContState={props.setContState} />
            </div>
           
            <div className="col-3 pplefcol">
                <div className="pp-fixed-container">
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
                               onClick={reset}/>
                    </div>
                </div>
            </div> 
        </div>
    );
}  
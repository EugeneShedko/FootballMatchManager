import "./../../css/playerspage.css"
import PlayerBlock from "../playerblock";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Players(props) {

    const [players, setPlayers] = useState([]);
    const [searchString, setSearchString] = useState("");

    const searchPlayers = players.filter(searchingPlayer =>{
        return String(searchingPlayer.userFirstName + ' ' + searchingPlayer.userLastName).toLowerCase().includes(searchString.toLowerCase().trim())
    })

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/allplayers', { withCredentials: true })
                .then((response) => {
                    setPlayers(response.data);
                    console.log(response.data);
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
        }, []
    );
    return (
        <div className="row ppplayers-main-container">
            <div className="col-9 ppplayers-container">
                <div className="row ppplayers-absolute-container">
                    {(searchPlayers.length === 0 && searchString != '') && <div>Пользователей нет</div>}
                    {searchPlayers?.map((player) => (
                        <div className="ppinfo-block">
                            <PlayerBlock info={player} 
                                         setContState = {props.setContState}/> 
                        </div>
                    ))}
                </div>
            </div>
           
            <div className="col-3 pplefcol">
                <div className="pp-fixed-container">
                    <div className="row pplcrow">
                        <input id="search-player-element" value={searchString} onChange={(e) => setSearchString(e.target.value)} type="text" placeholder="Введите имя игрока" />
                    </div>
                    <div className="row filter-player-container">
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            НП
                        </label>
                        <label>

                            <input type="checkbox" className="checkbox-style" />
                            ЛПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ППЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            АПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ЦПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ОПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ЛЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ЦЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            В
                        </label>
                        <input className="ppbutton-style" type="button" value="Применить" />
                    </div>
                </div>
            </div> 
        </div>
    );
}  
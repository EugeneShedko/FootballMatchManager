import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GameGenerator from "../../UserAccaunt/Games/ViewGames/GameGenerator";
import PlayerGenerator from "./../../UserAccaunt/Players/ViewPlayers/PlayerGenerator";

export default function MainContent(props) {

    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);

    // ------------------------------------------------------------------------------------ //

    useEffect(
        () => {

            axios.get('http://localhost:5004/api/profile/all-players', { withCredentials: true })
                .then((response) => {
                    setPlayers(response.data);
                    console.log(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error("Ошибка получения пользователей",
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });

            axios.get('http://localhost:5004/api/profile/get-all-games', { withCredentials: true })
                .then((response) => {
                    setGames(response.data);
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
        }, []
    );

    // ------------------------------------------------------------------------------------ //

    const [searchGameString, setSearchGameString] = useState("");
    const [searchPlayerString, setSearchPlayerString] = useState("");


    return (
        <div className="row justify-content-center m-0">
            <div className="col-3 map-el-container">
                <div className="row search-block">
                    <input className="serach-element"
                        type="text"
                        placeholder="Введите для поиска матча ..."
                        value={searchGameString}
                        onChange={(e) => { setSearchGameString(e.target.value) }} />
                </div>
                <GameGenerator games={games}
                               searchString={searchGameString} />
            </div>
            {/*
            <div className="col-3 map-el-container">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска турнира ..." />
                </div>
            </div>*/}

            <div className="col-3 map-el-container">
                <div className="search-block">
                    <input className="serach-element"
                        type="text"
                        placeholder="Введите для поиска игрока ..."
                        value={searchPlayerString}
                        onChange={(e) => setSearchPlayerString(e.target.value)} />
                </div>
                <PlayerGenerator players={players} 
                                 searchString={searchPlayerString} />
            </div>
        </div>
    );
}
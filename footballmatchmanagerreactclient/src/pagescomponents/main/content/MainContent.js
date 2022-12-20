import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GameGenerator from "../../GameGenerator";
import PlayerGenerator from "../../PlayerGenerator";

/*Проблема с выравниванием!*/
/*Создавать ли здесь враперы? -> если будет время*/

export default function MainContent(props) {

    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/allplayers', { withCredentials: true })
                .then((response) => {
                    setPlayers(response.data);
                    console.log(response.data);
                })
                .then(() => {

                    axios.get('https://localhost:7277/api/profile/allmatches', { withCredentials: true })
                        .then((response) => {
                            setGames(response.data);
                            console.log(response.data);
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
            {
            <div className="col-3 map-el-container">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска турнира ..." />
                </div>
            </div>
            }

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
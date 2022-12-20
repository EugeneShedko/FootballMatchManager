import "./../../css/matchespage.css"
import { useEffect, useState } from "react";
import CreateMatch from "./creatematch";
import GameGenerator from "../GameGenerator";
import axios from "axios";
import { toast } from "react-toastify";

export default function Matches(props) {

    const [createMatchVisible, setcreateMatchVisible] = useState(false);
    const [games, setGames] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
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
            ;
        }, []
    );

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
                            <input type="checkbox" className="checkbox-style" />
                            5x5
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            9x9
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            11x11
                        </label>
                        <input className="mpbutton-style" type="button" value="Применить" />
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
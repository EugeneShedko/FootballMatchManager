import "./../../css/matchespage.css"
import MatchBlock from "../matchblock";
import { useEffect, useState } from "react";
import CreateMatch from "./creatematch";
import axios from "axios";
import { toast } from "react-toastify";

export default function Matches(props) {

    const [createMatchVisible, setcreateMatchVisible] = useState(false);
    const [matches, setMatches] = useState([]);

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/allmatches', { withCredentials: true })
                .then((response) => {
                    setMatches(response.data);
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
                <div className="row mpmatches-absolute-container">
                    {
                        matches.map((match) => (
                            <div className="mpinfo-block">
                                <MatchBlock info={match}
                                    setContState={props.setContState} />
                            </div>
                        ))
                    }
                </div>
            </div>
            {props.isPanel ?
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        <input className="mpbutton-style" type="button" value="Создать матч" onClick={() => setcreateMatchVisible(true)} />
                    </div>
                    <div className="row mplcrow">
                        <input id="search-match-element" type="text" placeholder="Введите название матча" />
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
            </div> : null}
            <CreateMatch show={createMatchVisible} 
                         onHide={setcreateMatchVisible} 
                         setAllMatches={setMatches} 
                         />
        </div>
    );
}  
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "../../matchblock";
import {Context} from "../../../index"
import GameGenerator from "../../GameGenerator";
import CreateMatch from "../creatematch";


export default function UserMatchesCr(props) {

    const {user} = useContext(Context);

    const [createMatchVisible, setcreateMatchVisible] = useState(false);
    const [userMatchPr, setUserMatchPr] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {

            const data = new FormData();
            data.append("userId", user.getUserId);

            axios.post('https://localhost:7277/api/profile/userpartmatch', data ,{ withCredentials: true })
                .then((response) => {
                    setUserMatchPr(response.data);
                    console.log("creator" + response.data);
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
        <div className="row mpmatches-main-container">
        <div className="col-9 mpmatches-container">
            <GameGenerator games={userMatchPr}
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
        <CreateMatch show   = {createMatchVisible} 
                     onHide = {setcreateMatchVisible} 
        />
    </div>
    );
}

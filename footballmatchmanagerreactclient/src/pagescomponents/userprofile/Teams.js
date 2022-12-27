import "./../../css/matchespage.css"
import { useEffect, useState } from "react";
import CreateMatch from "./CreateMatch";
import GameGenerator from "../GameGenerator";
import axios from "axios";
import { toast } from "react-toastify";
import TeamGenerator from "../TeamsGenerator";
import CreateTeam from "./CreateTeam";

export default function Teams(props) {

    const [createTeamVisible, setcreateTeamVisible] = useState(false);
    const [teams, setTeams] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/allteams', { withCredentials: true })
                .then((response) => {
                    setTeams(response.data);
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
                {
                    
                    <TeamGenerator teams={teams}
                    setGames={setTeams}
                    searchString={searchString}
                    setContState={props.setContState} />
                    
                }
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                <div className="row mplcrow">
                        <input className="mpbutton-style" 
                               type="button" 
                               value="Создать команду" 
                               onClick={() => setcreateTeamVisible(true)} />
                    </div>
                    <div className="row mplcrow">
                        <input id="search-match-element"
                            type="text"
                            placeholder="Введите название команды"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <CreateTeam show={createTeamVisible} 
                         onHide={setcreateTeamVisible}
                         setAllTeams={setTeams}  
            />
        </div>
    );
}
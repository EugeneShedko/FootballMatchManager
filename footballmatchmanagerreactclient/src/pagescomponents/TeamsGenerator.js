import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "./MatchBlock";
import TeamBlock from "./TeamBlock";


export default function TeamGenerator(props) {

    const searchTeams = props.teams.filter(searchingTeams =>{ 
    return String(searchingTeams.teamName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })
    
    return (
        <div className="row mpmatches-absolute-container">
            {(searchTeams.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {
                searchTeams?.map((team) =>
               (
                    
                    <div className="mpinfo-block">
                        <TeamBlock info={team}
                                    setGames={props.setTeams}
                                    setContState={props.setContState} />
                    </div>
                    
                ))
            }
        </div>
    );
}
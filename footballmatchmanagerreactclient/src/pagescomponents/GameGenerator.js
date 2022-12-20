import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "./matchblock";


export default function GameGenerator(props) {

    const searchGamse = props.games.filter(searchingGames =>{ 
    return String(searchingGames.gameName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })
    
    return (
        <div className="row mpmatches-absolute-container">
            {(searchGamse.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {
                searchGamse?.map((match) => (
                    <div className="mpinfo-block">
                        <MatchBlock info={match}
                                    setGames={props.setGames}
                                    setContState={props.setContState} />
                    </div>
                ))
            }
        </div>
    );
}
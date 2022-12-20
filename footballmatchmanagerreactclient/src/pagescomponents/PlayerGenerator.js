import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerBlock from "./playerblock";

export default function PlayerGenerator(props) 
{
        
    const searchPlayers = props.players.filter(searchingPlayer =>{ 
    return String(searchingPlayer.userFirstName + ' ' + searchingPlayer.userLastName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    return (
        <div className="row ppplayers-absolute-container">
            {(searchPlayers.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {searchPlayers?.map((player) => (
                <div className="ppinfo-block">
                    <PlayerBlock info={player}
                                 setContState={props.setContState} />
                </div>
            ))}
        </div>
    );
}


//const [searchString, setSearchString] = useState("");

//const searchPlayers = players.filter(searchingPlayer =>{
//    return String(searchingPlayer.userFirstName + ' ' + searchingPlayer.userLastName).toLowerCase().includes(searchString.toLowerCase().trim())
//})

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerBlock from "./PlayerBlock";

export default function PlayerGenerator(props) 
{
        
    const searchPlayers = props.players.filter(searchingPlayer =>{ 
    return String(searchingPlayer.firstName + ' ' + searchingPlayer.lastName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    // --------------------------------------------------------------------------------------------- //

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

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerBlock from "./PlayerBlock";
import { useLocation } from "react-router-dom";
import { TO_GAME_INVITE } from "../../../../Utilts/Consts";

export default function PlayerGenerator(props) 
{
    const [isInvite, setIsInvite] = useState(useLocation().pathname.includes(TO_GAME_INVITE) ? true : false);

    // --------------------------------------------------------------------------------------------- //
        
    const searchPlayers = props.players.filter(searchingPlayer =>{ 
    return String(searchingPlayer.firstName + ' ' + searchingPlayer.lastName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    // --------------------------------------------------------------------------------------------- //

    return (
        <div className="row ppplayers-absolute-container">
            {(searchPlayers.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {searchPlayers?.map((player) => (
                <div className={isInvite ? "ppinfo-block-no-hover": "ppinfo-block"}>
                    <PlayerBlock info={player} />
                </div>
            ))}
        </div>
    );
}

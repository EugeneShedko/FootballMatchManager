import { useEffect, useState } from "react";
import Players from "../../Players/ViewPlayers/Players";
import "./../../../../css/GameInvite/GameInvite.css";
import axios from "axios";
import PlayerGenerator from "../../Players/ViewPlayers/PlayerGenerator";

export default function InviteCard()
{
    const [players, setPlayers] = useState([]);

    // ------------------------------------------------- //

    useEffect(() => {
            axios.get('http://localhost:5004/api/profile/all-players', { withCredentials: true })
                .then((response) => {
                    //setInitPlayers(response.data);
                    setPlayers(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                    }
                });
        }, []);

    // ------------------------------------------------- //

    return(
        <div className="row mi-info-main-container">
            <div className="col-11 mi-info-container">
                <PlayerGenerator players={players}
                                 searchString=""/>
            </div>
        </div>
    )
}
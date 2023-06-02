import { useEffect, useState } from "react";
import PlayerBlock from "../../../Players/ViewPlayers/PlayerBlock";
import { toast } from "react-toastify";
import axios from "axios";

export default function GameParticipantPlayers(props) {

    const [gameUsers, setGameUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // --------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/profile/game-users/' + props.gameId, { withCredentials: true })
            .then((response) => {
                setGameUsers(response.data);
                setIsLoading(true);
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
    }, [props.refresh, props.refreshGame])

    // ------------------------------------------------------------------ //

    if (isLoading) {
        return (
            <>
                <div className="match-info-user-absolute-container">
                    {
                        gameUsers?.map((player) => (
                            <div key={player.pkId} className="row m-0">
                                <PlayerBlock info={player}
                                             isGameCard={true}
                                             isCreat={props.isCreat}
                                             deleteUser={props.deleteUser}
                                             gameCreatroId={props.gameCreatroId}
                                             />
                            </div>
                        ))
                    }
                </div>
            </>
        );
    }
}
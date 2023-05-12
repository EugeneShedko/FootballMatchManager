import { useEffect, useState } from "react";
import PlayerBlock from "../Players/ViewPlayers/PlayerBlock";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeamParticipants(props) {

    const [teamUsers, setTeamUsers] = useState([]);

    // ----------------------------------------------------- //

    useEffect(() => {
        axios.get('http://localhost:5004/api/team/team-users/' + props.teamId, { withCredentials: true })
            .then((response) => {
                setTeamUsers(response.data);
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

    }, [props.teamId, props.refresh])

    // ----------------------------------------------------- //

    return (<>
        <div className="team-info-user-absolute-container">
            {
                teamUsers.map((player) => (
                    <div key={player.pkId} className="row m-0 p-0">
                        <PlayerBlock info={player}
                        isCreat={props.isCreat}
                        deleteUserTeam={props.deleteUserTeam}
                        />
                    </div>
                ))
            }
        </div>
    </>);
}

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../index"
import ExistsTeamCard from "./ExistsTeamCard";
import NoExistTeamCard from "./NoExistTeamCard";

/* Можно было бы функции вынести просто в отдельный файл, вид карточки один */
/* А у меня получилось два компонента для этого */

export default function UserTeamsInfoCard() {

    const { userContext } = useContext(Context);
    const [teamId, setTeamId] = useState(null);
    const [userTeams, setUserTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadTeam, setReloadTeams] = useState(false);

    // -------------------------------------------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/team/user-team', { withCredentials: true })
            .then((response) => {

                if(response.data.firstTeamId !== -1)
                {
                    setTeamId(response.data.firstTeamId);
                    setUserTeams(response.data.teamsPart)     
                    setIsLoading(true);               

                }
                setTeamId(response.data.firstTeamId);
                setIsLoading(true); 
                //setReloadTeams(false);
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
    }, [reloadTeam]);

    // -------------------------------------------------------------------------------------------------------------------------- //

    function updateCard()
    {
        setReloadTeams(true);
    }

    // -------------------------------------------------------------------------------------------------------------------------- //

    return (
        <>
        {
            isLoading ?
             teamId === -1 ? <NoExistTeamCard /> :<ExistsTeamCard  teamId={teamId}
                                                                   userTeams={userTeams}
                                                                   update={updateCard}
                                                                   />
            : null                                                       
        }        
        </>
    );
}    

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../index"
import { HubConnectionBuilder } from "@microsoft/signalr";

import MessagesBlock from "./../Games/ViewGameCard/MessagesBlock";
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

    /* Может просто перечитать тогда? */
    useEffect(() => {

        axios.get('http://localhost:5004/api/team/user-team', { withCredentials: true })
            .then((response) => {

                /* Пока что не понятно, что будет если приедт null */
                /* Состояние для хранения листа айдишников */
                if(response.data.firstTeamId !== -1)
                {
                    setTeamId(response.data.firstTeamId);
                    setUserTeams(response.data.teamsPart)     
                    setIsLoading(true);               

                }
                setTeamId(response.data.firstTeamId);
                setIsLoading(true); 
                //setReloadTeams(false);
                console.log('EFFECT');
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
        console.log('UPDATE!');
    }

    // -------------------------------------------------------------------------------------------------------------------------- //

    return (
        <>
        {console.log('teamId')}
        {console.log(teamId)}
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
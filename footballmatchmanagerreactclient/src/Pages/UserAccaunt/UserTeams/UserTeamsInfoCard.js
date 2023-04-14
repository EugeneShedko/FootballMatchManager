
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

export default function UserTeamsInfoCard(props) {

    const { user } = useContext(Context);
    const [teamId, setTeamId] = useState();
    const [userTeams, setUserTeams] = useState([]);

    // -------------------------------------------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/team/user-team', { withCredentials: true })
            .then((response) => {

                /* Пока что не понятно, что будет если приедт null */
                /* Состояние для хранения листа айдишников */
                if(response.data.firstTeamId !== -1)
                {
                    setTeamId(response.data.firstTeamId);
                    setUserTeams(response.data.teamsPart)                    

                }
                setTeamId(response.data.firstTeamId);
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
    }, [props]);

    // -------------------------------------------------------------------------------------------------------------------------- //

    /*
    function getTeamInfo(teamId) {
        ** Здесь же сразу можно было добавить вычет сообщений **

        axios.get('http://localhost:5004/api/team/team/' + teamId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/team/team-users/' + teamId, { withCredentials: true })
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
    }
    */
    // -------------------------------------------------------------------------------------------------------------------------- //

    /*
    function leaveTeam() {

        axios.delete('http://localhost:5004/api/profile/leavefromteam/' + props.teamId + '/' + user.getUserId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                setTeam(response.data.currteam);
                setTeamUsers(response.data.users);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message,
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

    }
    */

    // -------------------------------------------------------------------------------------------------------------------------- //

    return (
        <>
        {/* Почему то рендерится сначала со значением undefined, посмотреть в консоли */}
        {console.log('teamId')}
        {console.log(teamId)}
        {
            teamId === -1 ? <NoExistTeamCard /> :<ExistsTeamCard  teamId={teamId}
                                                                  userTeams={userTeams}
                                                                  />
        }        
        </>
    );
}    
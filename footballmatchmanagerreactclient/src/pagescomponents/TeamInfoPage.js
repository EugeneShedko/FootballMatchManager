/*Инфу скорее всего получать через props*/
/*Получился двойной props, не факт, что получиться передать*/

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../css/matchinfopage.css"
import PlayerBlock from "./playerblock";
import { Context } from "./../index"
import Matches from "./userprofile/matches";
import EditGame from "./userprofile/EditGame";
import MessageBlock from "./userprofile/MessageBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";


export default function TeamInfoPage(props) {

    const { user } = useContext(Context);
    const [team, setTeam] = useState({});
    const [teamUsers, setTeamUsers] = useState([]);
    const [isPart, setIsPart] = useState(false);

    useEffect(() => {

        axios.get('https://localhost:7277/api/profile/team/' + props.teamId + "/" + user.getUserId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
                setIsPart(response.data.isPart);
            })
            .then(() => {
                axios.get('https://localhost:7277/api/profile/teamusers/' + props.teamId, { withCredentials: true })
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
    
        }, []);

    function addToTeam() {

        const data = new FormData();
        data.append("teamId", props.teamId);
        data.append("userId", user.getUserId);

        axios.post('https://localhost:7277/api/profile/addtoteam', data, { withCredentials: true })
            .then((response) => {
                setTeamUsers(response.data.users);
                setTeam(response.data.currteam);
                setIsPart(true);
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error("Ошибка регистрации на матч",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }

    function leaveTeam() {

        axios.delete('https://localhost:7277/api/profile/leavefromteam/' + props.teamId + '/' + user.getUserId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                setTeam(response.data.currteam);
                setTeamUsers(response.data.users);
                setIsPart(false);
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


    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-7 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-6 match-info-text-container">
                        <div className="row match-info-title">
                            {team.teamName}
                        </div>
                        <div className="row match-info-header">
                            Дата создания команды
                        </div>
                        <div className="row match-info-text">
                            {(new Date(team.createDate)).toLocaleString().substring(0, (new Date(team.createDate)).toLocaleString().length - 3)}
                        </div>
                        <div className="row match-info-header">
                        </div>
                        <div className="row match-info-text">
                        </div>
                        <div className="row match-info-header">
                        </div>
                        <div className="row match-info-text">
                        </div>
                        <div className="row match-info-header">
                        </div>
                        <div className="row match-info-text">
                        </div>
                        <div className="row match-join-button-container">
                            {isPart ? null : <input className="match-join-button" 
                                                    type="button" 
                                                    value="Присоединиться" 
                                                    onClick={addToTeam} />}
                            {isPart ? <input className="match-join-button"
                                type="button"
                                value="Покинуть"
                                onClick={leaveTeam} /> : null}
                        </div>
                    </div>
                    {
                        <div className="col-6 match-info-user-container">
                            <div className="match-info-user-absolute-container">
                                {
                                    teamUsers.map((player) => (
                                        <div className="row m-0">
                                            <PlayerBlock info={player} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}    
/*Инфу скорее всего получать через props*/
/*Получился двойной props, не факт, что получиться передать*/

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../css/GameInfoCard.css"
import PlayerBlock from "./playerblock";
import { Context } from "./../index"
import Matches from "./userprofile/matches";
import EditGame from "./userprofile/EditGame";
import MessageBlock from "./userprofile/MessageBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";
import MatchBlock from "./matchblock";
import TeamBlock from "./TeamBlock";


export default function TourInfoPage(props) {

    const { user } = useContext(Context);
    const [tour, setTour] = useState({});
    const [tourTeams, setTourTeams] = useState([]);
    const [isPart, setIsPart] = useState(false);
    const [isCreat, setIsCreat] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [changes, setChanges] = useState({
        gameId: 0,
        gameName: "",
        gameDate: new Date(),
        gameFormat: "",
        gameAdress: "",
    });

    useEffect(() => {

        axios.get('http://localhost:5004/api/profile/tour/' + props.tourId + "/" + user.getUserId, { withCredentials: true })
            .then((response) => {
                setTour(response.data.currtour);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/profile/tourteams/' + props.tourId, { withCredentials: true })
                    .then((response) => {
                        setTourTeams(response.data);
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

    function addToTour() {

        const data = new FormData();
        data.append("tourId", props.tourId);
        data.append("userId", user.getUserId);

        axios.post('http://localhost:5004/api/profile/addtotour', data, { withCredentials: true })
            .then((response) => {
                setTourTeams(response.data.tteams);
                setTour(response.data.currtour);
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

    function leaveTour() {

        axios.delete('http://localhost:5004/api/profile/leavefromtour/' + props.tourId + '/' + user.getUserId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                setTour(response.data.currtour);
                setTourTeams(response.data.tteams);
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

    {/*

    function deleteTour() {
        axios.delete('http://localhost:5004/api/profile/deletegame/' + game.gameId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                props.setGames(response.data.rgames);
                props.setContState(<Matches setContState={props.setContState} />);
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

    function editTour() {
        setChanges({
            gameId: game.gameId,
            gameName: game.gameName,
            gameDate: new Date(game.gameDateTime),
            gameFormat: game.gameFormat,
            gameAdress: game.gameAdress,
        });
        setEditProfileVisible(true);
    }
    */}
    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-10 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-4 match-info-text-container">
                        <div className="row match-info-title">
                            {tour.tournamentName}
                        </div>
                        <div className="row match-info-header">
                            Дата начала турнира
                        </div>
                        <div className="row match-info-text">
                            {(new Date(tour.tournamentStartDate)).toLocaleString().substring(0, (new Date(tour.tournamentStartDate)).toLocaleString().length - 3)}
                        </div>
                        <div className="row match-info-header">
                            Дата окончания турнира
                        </div>
                        <div className="row match-info-header">
                            {(new Date(tour.tournamentEndDate)).toLocaleString().substring(0, (new Date(tour.tournamentEndDate)).toLocaleString().length - 3)}
                        </div>
                        <div className="row match-info-header">
                            Количество участников турнира
                        </div>
                        <div className="row match-info-text">
                            {tour.teamsNumber}
                        </div>
                        <div className="row match-info-header">
                            Призовой фон турнира
                        </div>
                        {/*можно вывести еше максимальное*/}
                        <div className="row match-info-text">
                            {tour.tournamentPrizeFund}
                        </div>
                        <div className="row match-join-button-container">
                            {isPart ? null : <input className="match-join-button" 
                                                    type="button" 
                                                    value="Присоединиться" 
                                                    onClick={addToTour} />
                                                    }
                            {isPart ? <input className="match-join-button"
                                type="button"
                                value="Покинуть"
                                onClick={leaveTour} /> : null}
                            {isCreat ? <input className="match-join-button"
                                type="button"
                                value="Редактировать"
                                /> : null}
                            {isCreat ? <input className="match-join-button"
                                type="button"
                                value="Удалить"
                                /> : null}
                        </div>
                    </div>
                    {
                        <div className="col-4 match-info-user-container">
                            <div className="match-info-user-absolute-container">
                                {
                                    tourTeams.map((team) => (
                                        <div className="row m-0">
                                            <TeamBlock info={team} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/*
                        <EditGame setGame={setGame}
                info={changes}
                setInfo={setChanges}
                show={editProfileVisible}
                onHide={setEditProfileVisible}
            />

                */}
        </div>
    );
}    
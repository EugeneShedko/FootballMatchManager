/*Инфу скорее всего получать через props*/
/*Получился двойной props, не факт, что получиться передать*/

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../css/matchinfopage.css"
import PlayerBlock from "./playerblock";
import { Context } from "./../index"

export default function MatchInfoPage(props) {

    const { user } = useContext(Context);
    const [game, setGame] = useState({});
    const [gameUsers, setGameUsers] = useState([]);

    useEffect(() => {

        axios.get('https://localhost:7277/api/profile/game/' + props.gameId, { withCredentials: true })
            .then((response) => {
                setGame(response.data);
            })
            .then(() => {
                axios.get('https://localhost:7277/api/profile/matchUsers/' + props.gameId, { withCredentials: true })
                    .then((response) => {
                        setGameUsers(response.data);
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

        /*
        axios.get('https://localhost:7277/api/profile/matchprofile/' + props.gameId, { withCredentials: true })
            .then((response) => {
                setGameUsers(response.data);
                console.log("!!!!! " + response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error("Ошибка получения данных",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
        */
    }, [])

    function addToMatch() {

        const data = new FormData();
        data.append("gameId", props.gameId);
        data.append("userId", user.getUserId);

        axios.post('https://localhost:7277/api/profile/addtomatch', data, { withCredentials: true })
            .then((response) => {
                setGameUsers(response.data.users);
                setGame(response.data.currgame);                
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

    //Переделать
    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-7 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-6 match-info-text-container">
                        <div className="row match-info-title">
                            {game.gameName}
                        </div>
                        <div className="row match-info-header">
                            Время матча
                        </div>
                        <div className="row match-info-text">
                            {(new Date(game.gameDateTime)).toLocaleString().substring(0, (new Date(game.gameDateTime)).toLocaleString().length - 3)}
                        </div>
                        <div className="row match-info-header">
                            Формат матча
                        </div>
                        <div className="row match-info-text">
                            {game.gameFormat}
                        </div>
                        <div className="row match-info-header">
                            Адрес
                        </div>
                        <div className="row match-info-text">
                            {game.gameAdress}
                        </div>
                        <div className="row match-info-header">
                            Текущее количество игроков
                        </div>
                        {/*можно вывести еше максимальное*/}
                        <div className="row match-info-text">
                            {game.currentPlayers}
                        </div>
                        <div className="row match-join-button-container">
                            <input className="match-join-button" type="button" value="Присоединиться" onClick={addToMatch} />
                        </div>
                    </div>
                    {
                    <div className="col-6 match-info-user-container">
                        <div className="match-info-user-absolute-container">
                            {
                                gameUsers.map((player) => (
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
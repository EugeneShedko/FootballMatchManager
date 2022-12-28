import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminPlayerBlock from "../players/adminPlayerBlock";
import "./../../css/matchinfopage.css";
import { Context } from "./../../index"
import AdminMatches from "./AdminGames";

export default function AdminMatchInfoPage(props) {

    const { user } = useContext(Context);
    const [game, setGame] = useState({});
    const [gameUsers, setGameUsers] = useState([]);
    const isMatch = true;

    useEffect(() => {

        axios.get('https://localhost:7277/api/admin/profile/match/' + props.gameId, { withCredentials: true })
            .then((response) => {
                setGame(response.data);
            })
            .then(() => {
                axios.get('https://localhost:7277/api/admin/profile/matchUsers/' + props.gameId, { withCredentials: true })
                    .then((response) => {
                        setGameUsers(response.data);
                    })
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
    }, [])

    function deleteMatch() {

        axios.delete('https://localhost:7277/api/admin/profile/deletegame/' + game.gameId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                props.setMatches(response.data.rgames);
                props.setContState(<AdminMatches setContState={props.setContState} />);
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

    function blockMatch()
    {
        const data = new FormData();
        data.append("gameId", game.gameId);

        axios.post('https://localhost:7277/api/admin/profile/blockgame/', data, { withCredentials: true })
        .then((response) => {
            setGame(response.data.currgame);
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
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

    function unblockMatch()
    {

        const data = new FormData();
        data.append("gameId", game.gameId);

        axios.post('https://localhost:7277/api/admin/profile/unblockgame/', data, { withCredentials: true })
        .then((response) => {
            setGame(response.data.currgame);
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
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

    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-9 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-5 match-info-text-container">
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
                        <div className="row match-info-text">
                            {game.currentPlayers}
                        </div>
                    </div>
                    <div className="col-5 match-info-user-container">
                        <div className="match-info-user-absolute-container">
                            {
                                gameUsers.map((player) => (
                                    <div className="row m-0">
                                        <AdminPlayerBlock info={player}
                                            setContState={props.setContState}
                                            setGame={setGame}
                                            setPlayers={setGameUsers}
                                            gameId={game.gameId}
                                            isMatch={true} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-2 p-0">
                        <div className="row match-type">
                            {game.gameStatus === 'block' ? 'Заблокирован' : null}
                        </div>
                        <div className="row match-admin-button">
                            {game.gameStatus === 'block' ? <input type="button" 
                                                                  value="Разблокировать" 
                                                                  className="match-just-button" 
                                                                  onClick={unblockMatch} /> 
                                                                  : 
                                                            <input type="button" 
                                                                   value="Заблокировать" 
                                                                   className="match-danger-button" 
                                                                   onClick={blockMatch} />}
                        </div>
                        <div className="row match-admin-button">
                            <input type="button" value="Удалить матч" className="match-danger-button" onClick={deleteMatch} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
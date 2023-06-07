import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../index";

import "./../../../css/CreateGame.css";
import { useLocation, useNavigate } from "react-router-dom";
import { TO_GAME_CARD, TO_TEAM_CARD, TO_TEAM_GAME_CARD } from "../../../Utilts/Consts";

export default function EditTeamGame(props) {

    const { userContext } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const [gameInfo, setGameInfo] = useState({
        gameId: location.state.gameId,
        gameName: location.state.gameName,
        gameDate: location.state.gameDate,
        gameFormat: location.state.gameFormat,
        gameAdress: location.state.gameAdress
    });

    // ----------------------------------------------------------- //

    function saveChanges() {

        const match = {
            UserId: userContext.userId,
            GameId: gameInfo.gameId,
            GameName: gameInfo.gameName,
            GameAdress: gameInfo.gameAdress,
            GameDate: gameInfo.gameDate,
            GameFormat: gameInfo.gameFormat,
            GameType: ""
        }

        axios.put('http://localhost:5004/api/teamgame/edit-teamgame', match, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

                navigate(TO_TEAM_GAME_CARD + '/' + gameInfo.gameId)
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

    // ------------------------------------------------------------------------------------------ //

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
    
        return currentDate.getTime() < selectedDate.getTime();
      };

    // ------------------------------------------------------------------------------------------ //

    return (
        <Modal show={props.show}
            onHide={() => navigate(TO_TEAM_GAME_CARD + '/' + gameInfo.gameId)}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Редактирование матча
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row m-0 p-0">
                    <div className="col input-elem-cont">
                        <div className="row input-containerr">
                            <input className="input-stylee"
                                type="text"
                                placeholder="Наименование матча"
                                value={gameInfo.gameName}
                                disabled={true}
                            />
                        </div>
                        <div className="row input-containerr">
                            <div className="m-0 p-0">Дата матча</div>
                            <ReactDatePicker 
                                className="input-stylee"
                                selected={gameInfo.gameDate}
                                onChange={(date: Date) => { setGameInfo({ ...gameInfo, gameDate: date }) }}
                                showTimeSelect={true}
                                timeIntervals={15}
                                timeFormat="HH:mm"
                                timeCaption="Time"
                                dateFormat="yyyy-MM-dd HH:mm"
                                minDate={new Date()}
                                filterTime={filterPassedTime}
                            />


                        </div>
                        <div className="row input-containerr">
                            <input className="input-stylee"
                                type="text"
                                value={gameInfo.gameAdress}
                                onChange={(e) => { setGameInfo({ ...gameInfo, gameAdress: e.target.value }) }}
                            />
                        </div>
                        <div className="row input-containerr">
                            <input className="input-button-style"
                                type="button"
                                value="Сохранить"
                                onClick={saveChanges}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
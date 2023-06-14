import "./../../../../css/CreateGame.css"
import { Modal } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../../index"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_PLAYER_CARD } from "../../../../Utilts/Consts";

export default function BlockPlayer(props) {

    const location = useLocation();
    const navigate = useNavigate();
    const { userContext, setUserContext } = useContext(Context);
    /* Айди пользователя */
    const { id } = useParams();
    /* Другая причина блокировки */
    const [reasons, setReasons] = useState([]);
    const [selectdGames, setSelectedGames] = useState([]);
    const [gamesParticipant, setGamesParticipant] = useState([]);
    const [gamesCreator, setGamesCreator] = useState([]);
    const [teamGamesParticipant, setTeamGameParticipant] = useState([]);
    const [teamGamesCreator, setTeamGameCreator] = useState([]);
    const currentReason = useRef(null);

    /* Дополнительные поля для отображения */
    const [viewAddFields, setViewAddFields] = useState({
        reason: false,
        gameType: false,
        game: false,
    })

    const [fieldValue, setFieldValue] = useState({
        reasonId: -1,
        gameType: ''
    });

    const [complainInfo, setComplainInfo] = useState({
        userId: id,
        blockPeriod: 0,
        reasonId: -1,
        reasonText: '',
        gameName: '',
        gameId: -1
    });

    // --------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/profile/block-reason', { withCredentials: true })
            .then((response) => {
                setReasons(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log(userError.response.data.message);
                }
            });

        /* УЧАСТНИК МАТЧЕЙ */
        axios.get('http://localhost:5004/api/profile/user-part-game/' + id, { withCredentials: true })
            .then((response) => {
                setGamesParticipant(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log(userError.response.data.message);
                }
            });

        /* ОРГАНИЗАТОР МАТЧЕЙ */
        axios.get('http://localhost:5004/api/profile/user-creat-game/' + id, { withCredentials: true })
            .then((response) => {
                setGamesCreator(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log(userError.response.data.message);
                }
            });

        /* УЧАСТНИК КОМАНДНЫХ МАТЧЕЙ */
        axios.get('http://localhost:5004/api/teamgame/user-team-games/' + id, { withCredentials: true })
            .then((response) => {
                setTeamGameParticipant(response.data);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log(userError.response.data.message);
                }
            });

        /* Оргнизатор командных матчей */   
        axios.get('http://localhost:5004/api/teamgame/team-games-creat/' + id, { withCredentials: true })
            .then((response) => {
                setTeamGameCreator(response.data)
            })
            .catch(userError => {
                if (userError.response) {
                    console.log(userError.response.data.message);
                }
            });

    }, [])

    // --------------------------------------------------------------------- //

    useEffect(() => {

        let currReason = reasons.find((item) => item.pkId === parseInt(fieldValue.reasonId));
        if (!currReason) { return; }

        if (currReason.type !== 'game')
            setFieldValue({ ...fieldValue, gameType: '' });

    }, [fieldValue.reasonId]);

    useEffect(() => {

        const viewFields = {
            viewReson: viewAddFields.reason,
            viewGameType: viewAddFields.gameType,
            viewGame: viewAddFields.game
        };

        let currReason = reasons.find((item) => item.pkId === parseInt(fieldValue.reasonId));
        if (!currReason) { return; }

        if (currReason.type === 'another')
            viewFields.viewReson = true;
        else
            viewFields.viewReson = false;

        if (currReason.type === 'game') {
            viewFields.viewGameType = true;
        }
        else {
            viewFields.viewGameType = false;
            viewFields.viewGame = false;
        }

        setViewAddFields({
            ...viewAddFields,
            reason: viewFields.viewReson,
            gameType: viewFields.viewGameType,
            game: viewFields.viewGame
        });

    }, [fieldValue.reasonId])

    // --------------------------------------------------------------------- //

    useEffect(() => {

        let currReason = reasons.find((item) => item.pkId === parseInt(currentReason.current.value));
        if (!currReason || currReason.type !== 'game') { return; }

        if (fieldValue.gameType === 'game') {
            if (currReason.name === 'organize') {
                setSelectedGames(gamesCreator);
            }
            else {
                setSelectedGames(gamesParticipant);
            }

        }
        else {
            if (currReason.name === 'organize') {
                setSelectedGames(teamGamesCreator)
            }
            else {
                setSelectedGames(teamGamesParticipant);
            }
        }

    }, [fieldValue])

    // --------------------------------------------------------------------- //

    useEffect(() => {


        if (fieldValue.gameType !== '')
            setViewAddFields({ ...viewAddFields, game: true });
        else
            setViewAddFields({ ...viewAddFields, game: false });

    }, [fieldValue.gameType])

    // --------------------------------------------------------------------- //

    function gameHandler(event) {
        const selectedIndex = event.target.selectedIndex;
        const selectedOption = event.target.options[selectedIndex];

        setComplainInfo({ ...complainInfo, gameId: event.target.value, gameName: selectedOption.text });
    }

    // --------------------------------------------------------------------- //

    function blockUser() {

        axios.post('http://localhost:5004/api/profile/block-user', complainInfo, { withCredentials: true })
            .then((response) => {

                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

                navigate(TO_PLAYER_CARD + '/' + id);
            })
            .catch(userError => {
                if (userError.response) {
                    console.log('ОШИБКА БЛОКИРОВКИ ПОЛЬЗОВАТЕЛЯ');
                    console.log(userError.response.data.message);
                    props.onHide(false);
                }
            });
    }

    // --------------------------------------------------------------------- //

    return (
        <Modal show={props.show}
            onHide={() => navigate(TO_PLAYER_CARD + '/' + id)}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Блокировка пользователя
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row m-0 p-0">
                    <div className="col input-elem-cont">
                        <div className="row input-containerr">
                            <input className="input-stylee"
                                type="text"
                                placeholder="Имя"
                                value={location.state.userName}
                                disabled={true}
                            />

                        </div>
                        <div className="row input-containerr">
                            <select className="input-stylee"
                                onChange={(event) => setComplainInfo({ ...complainInfo, blockPeriod: event.target.value })}
                            >
                                <option disabled selected>Период блокировки</option>
                                <option value={5}>5 дней</option>
                                <option value={15}>15 дней</option>
                                <option value={30}>30 дней</option>
                                <option value={90}>90 дней</option>
                                <option value={-1}>Навсегда</option>
                            </select>
                        </div>
                        <div className="row input-containerr">
                            <select className="input-stylee"
                                ref={currentReason}
                                onChange={(event) => {
                                    setFieldValue({ ...fieldValue, reasonId: event.target.value });
                                    setComplainInfo({ ...complainInfo, reasonId: event.target.value });
                                }}
                            >
                                <option disabled selected value="-1">Причина блокировки</option>
                                {
                                    reasons?.map((item) =>
                                        <option value={item.pkId}>{item.strValue}</option>
                                    )
                                }
                            </select>
                        </div>
                        {viewAddFields.reason ?
                            <div className="row input-containerr">
                                <input className="input-stylee"
                                    type="text"
                                    placeholder="Введите причину"
                                    value={complainInfo.reasonText}
                                    onChange={(event) => {
                                        setComplainInfo({ ...complainInfo, reasonText: event.target.value })
                                    }}
                                />
                            </div>
                            : null}
                        {viewAddFields.gameType ?
                            <div className="row input-containerr">
                                <select className="input-stylee"
                                    onChange={(event) => setFieldValue({ ...fieldValue, gameType: event.target.value })}
                                >
                                    <option disabled selected value="">Выберите тип матч</option>
                                    <option value="game">Индивидуальный</option>
                                    <option value="teamgame">Командный</option>
                                </select>
                            </div>
                            : null}
                        {viewAddFields.game ?
                            <div className="row input-containerr">
                                <select className="input-stylee"
                                    onChange={(event) => gameHandler(event)}
                                >
                                    <option disabled selected value='-1'>Выберите матч</option>
                                    {
                                        selectdGames.map((game) =>
                                            <option value={game.pkId}>{game.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                            : null}    
                        <div className="row input-containerr">
                            <input className="player-delete-button"
                                type="button"
                                value="Заблокировать"
                                onClick={blockUser}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
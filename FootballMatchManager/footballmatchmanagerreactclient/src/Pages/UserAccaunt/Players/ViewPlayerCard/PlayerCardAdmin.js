import axios from "axios";
import { useEffect, useState, useRef, } from "react";
import { toast } from "react-toastify";
import UserCommentBlock from "./UserCommentBlock";
import { HubConnectionBuilder } from "@microsoft/signalr";

import "./../../../../css/PlayerCard.css";
import "react-datepicker/dist/react-datepicker.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_BLOCK_PLAYER, TO_USER_GAMES_PROFILE } from "../../../../Utilts/Consts";
import UserComplainBlock from "./UserComplainBlock";
import UserBlockBlock from "./UserBlockBlock";

export default function PlayerCardAdmin() {

    const navigate = useNavigate();
    const location = useLocation();

    const [isLoad, setIsLoad] = useState(false);
    const [userId, setUserId] = useState(parseInt(useParams().id));
    const [profileInfo, setProfileInfo] = useState({});
    const [profileDopInfo, setProfileDopInfo] = useState({});
    const [userComment, setUserComment] = useState([]);
    const [userComplain, setUserComplain] = useState([]);
    const [userBlocks, setUserBlocks] = useState([]);
    const [currentContainer, setCurrentContainer] = useState('1');
    /* Количество чего-то */
    const [number, setNumber] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    /* Измененная статистика */
    const [changeStat, setChangeStat] = useState({
        gamesQnt: '',
        goalsQnt: '',
        assistsQnt: ''
    });

    const commentContainer = useRef(null);
    const connection = useRef(null);

    // ------------------------------------------------------------------------------------------------ //

    useEffect(() => {
        const data = new FormData();
        data.append("userId", userId);

        axios.post('http://localhost:5004/api/profile/user-card', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
                setIsLoad(true);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/comment/user-card-comment/' + userId, { withCredentials: true })
                    .then((response) => {
                        setUserComment(response.data);
                    })
                    .catch(userError => {
                        if (userError.response) {
                            console.log('RESPONSE COMMENT ERROR');
                        }
                    });
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.data.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

        axios.get('http://localhost:5004/api/profile/last-block/' + userId, { withCredentials: true })
            .then((response) => {
                setProfileDopInfo({ ...profileDopInfo, lastBlock: response.data });
            })
            .catch(userError => {
                if (userError.response) {
                    console.log('ОШИБКА ПОЛУЧЕНИЯ ДАТЫ БЛОКИРОВКИ');
                    console.log(userError.response.data.message);
                }
            });

        getUserComplains();
        getUserBlocks();
        connectComment();

        return () => {
            if (connection.current) {
                connection.current.stop();
            }
        };

    }, [location.state && location.state.refresh]);

    useEffect(() => {

        if (currentContainer === '2')
            getUserComplains();

        if (currentContainer === '3')
            getUserBlocks();

    }, [currentContainer])

    // -------------  Получает блокировки пользователя ------------------------------------ //

    const getUserBlocks = async () => {

        axios.get('http://localhost:5004/api/profile/all-blocks/' + userId, { withCredentials: true })
            .then((response) => {
                setUserBlocks(response.data);
            })
            .catch(userError => {
                if (userError.response) {

                    console.log('Ошибка получения жалоб');
                    console.log(userError.response.data.message);
                }
            });

    }

    // -------------  Получает жалобы пользователя ------------------------------------ //

    const getUserComplains = async () => {

        axios.get('http://localhost:5004/api/profile/user-complains/' + userId, { withCredentials: true })
            .then((response) => {
                setUserComplain(response.data)
            })
            .catch(userError => {
                if (userError.response) {

                    console.log('Ошибка получения жалоб');
                    console.log(userError.response.data.message);
                }
            });
    }

    // ------------------------------------------------------------------------------------------------ //

    const connectComment = async () => {

        const hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/commentchat")
            .build();

        hubConnection.on("displayComment", (comment) => {
            setUserComment(userComment => [...userComment, comment]);
        });

        await hubConnection.start();
        connection.current = hubConnection;

        await hubConnection.invoke("Connect", String(userId));
    }


    // ---------------- Скролл  ------------------------------------------- //

    useEffect(() => {
        if (commentContainer.current)
            commentContainer.current.scrollTop = commentContainer.current.scrollHeight;
    }, []);

    // ------------------------------------------------------------------------------------------------ //

    function blockUser() {

        navigate(location.pathname + TO_BLOCK_PLAYER, {
            state: {
                userName: profileInfo.firstName + ' ' + profileInfo.lastName
            }
        });
    }

    function AnBlockUser() {

        axios.put('http://localhost:5004/api/profile/unblock-user/' + userId, { withCredentials: true })
            .then((response) => {

                setProfileInfo({ ...profileInfo, status: response.data.status });

                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

            })
            .catch(userError => {
                if (userError.response) {
                    console.log('ОШИБКА РАЗБЛОКИРОВКИ ПОЛЬЗОВАТЕЛЯ');
                    console.log(userError.response.data.message);
                }
            });

    }

    // ------------------------------------------------------------------------------------------------ //

    function deleteComment(commentId) {

        axios.delete('http://localhost:5004/api/comment/delete-comment/' + commentId, { withCredentials: true })
            .then((response) => {
                setUserComment(prevComment => prevComment.filter(iteam => iteam.pkId !== commentId))
            })
            .catch(userError => {
                if (userError.response) {
                    console.log('DELETE COMMENT');
                    console.log(userError.response.message);
                }
            });

    }

    // ------------------------------------ Обертки генераторы ---------------------------------------- //

    function CommentGenerator() {

        setNumber(userComment.length)

        return (<>
            {
                userComment.map((comment) =>
                    <UserCommentBlock key={comment.pkId} commentInfo={comment}
                        userprif={userId}
                        setUserComment={setUserComment}
                        deleteComment={deleteComment}
                    />
                )}
        </>);
    }

    function ComplainGenerator() {

        setNumber(userComplain.length)

        if (userComplain.length === 0)
            return <div className="no-complain"> На пользователя не поступало жалоб </div>

        return (<>
            {
                userComplain.map((complainInfo) =>
                    <UserComplainBlock complainInfo={complainInfo} />
                )
            }
        </>);
    }

    function BlocksGenerator() {

        setNumber(userBlocks.length)

        if (userBlocks.length === 0)
            return <div className="no-complain"> Пользователь не имеет блокировок </div>

        return (<>
            {
                userBlocks.map((blockInfo) =>
                    <UserBlockBlock blockInfo={blockInfo} />
                )
            }
        </>);

    }

    // ------------------------------------------------------------------------------------------------ //

    function selectInfoContainer() {
        switch (currentContainer) {
            case '1': return (<>
                <CommentGenerator />
            </>)
            case '2': return (<>
                <ComplainGenerator />
            </>)
            case '3': return <BlocksGenerator />;

            default: return null;
        }
    }

    // ------------------------------------------------------------------------------------------------ //

    function getBlockButton() {
        switch (profileInfo.status) {
            case 'active': return <BlockButton />;
            case 'block': return <AnBlockButton />;
            case 'delete': return <AnBlockButton />;;
            default: return null;
        }
    }

    function BlockButton() {
        return (<input type="button"
            value="Заблокировать"
            className="player-delete-button"
            onClick={blockUser}
        />
        );
    }

    function AnBlockButton() {
        return (<input type="button"
            value="Разблокировать"
            className="un-block-button"
            onClick={AnBlockUser}
        />
        );
    }

    // ------------------------------------------------------------------------------------------------ //

    function getStatusTitle() {

        let endBlockDate = "";

        if (profileInfo.status === 'active')
            return <div className="no-block-title">Активный</div>
        else {

            if (profileDopInfo.lastBlock && profileDopInfo.lastBlock.endBlockingDate)
                endBlockDate = new Date(profileDopInfo.lastBlock.endBlockingDate).toLocaleString()
                    .substring(0, (new Date(profileDopInfo.lastBlock.endBlockingDate))
                        .toLocaleString().length - 3);

            return (<div className="block-title">Заблокирован {endBlockDate ? 'до ' + endBlockDate : <><br /> Навсегда</>}</div>)
        }
    }

    // ------------------------------------------------------------------------------------------------ //

    function cancelEditStat() {

        setIsEditMode(false)
        setChangeStat({
            gamesQnt: '',
            goalsQnt: '',
            assistsQnt: ''
        });
    }

    function saveEditStat() {

        var data = new FormData();
        data.append("gamesQnt", changeStat.gamesQnt);
        data.append("goalsQnt", changeStat.goalsQnt);
        data.append("assistsQnt", changeStat.assistsQnt);

        axios.post('http://localhost:5004/api/profile/update-stat/' + userId, data, { withCredentials: true })
            .then((response) => {

                setProfileInfo(response.data.user);
                setIsEditMode(false)

                setChangeStat({
                    gamesQnt: '',
                    goalsQnt: '',
                    assistsQnt: ''
                });

                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

            })
            .catch(userError => {
                if (userError.response) {
                    toast.success("Ошибка обновления статистики",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });

                   console.log(userError.respone.data.log);
                   
                   setIsEditMode(false)

                   setChangeStat({
                       gamesQnt: '',
                       goalsQnt: '',
                       assistsQnt: ''
                   });
                }
            });

    }

    // ------------------------------------------------------------------------------------------------ //

    function getEditModeButton() {
        if (!isEditMode)
            return (<input type="button"
                value="Изменить статистику"
                className="profile-button"
                onClick={() => setIsEditMode(true)}
            />
            );
        else
            return (<div className="profile-edit-butt-cont">
                <div className="row profile-button-wrap">
                    <input type="button"
                        value="Сохранить"
                        className="un-block-button"
                        onClick={saveEditStat}
                    />
                </div>
                <div className="row profile-button-wrap">
                    <input type="button"
                        value="Отмена"
                        className="player-delete-button"
                        onClick={cancelEditStat}
                    />
                </div>
            </div>
            );
    }

    // ------------------------------------------------------------------------------------------------ //


    if (isLoad) {

        return (
            <div className="row profile-container">
                <div className="row profile-info-container m-0">
                    <div className="col-3 p-0">
                        <div className="row justify-content-center m-0">
                            <img className="profile-image"
                                src={"http://localhost:5004/" + profileInfo.image}
                                alt="" />
                        </div>
                    </div>
                    <div className="col-7 p-0 h-100">
                        <div className="row pruser-name">
                            {profileInfo.firstName + ' ' + profileInfo.lastName}
                        </div>
                        <div className="row prtext">
                            Дата рождения: {(new Date(profileInfo.birth)).toLocaleString().substring(0, (new Date(profileInfo.birth)).toLocaleString().length - 10)}
                        </div>
                        <div className="row prtext">
                            Позиция: {profileInfo.position}
                        </div>
                        <div className="row prtext">
                            Email: {profileInfo.email}
                        </div>
                        <div className="row icon-row">
                            <div className="col-3 p-0">
                                <div className="row m-0 p-0">
                                    <div className="col-6 p-0 m-0">
                                        <img className="foot-field-img" src="/image/soccer-field.png" alt="" />
                                    </div>
                                    <div className="col-6 p-0 m-0">
                                        <div className="row img-text">
                                            Игры
                                        </div>
                                        <div className="row img-number align-items-start">
                                            {isEditMode ? <input type="text"
                                                placeholder={profileInfo.gamesQnt}
                                                value={changeStat.gamesQnt}
                                                className="admin-edit"
                                                onChange={(event) => setChangeStat({ ...changeStat, gamesQnt: event.target.value })}
                                            />
                                                : profileInfo.gamesQnt}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3 p-0">
                                <div className="row m-0">
                                    <div className="col-6 d-flex align-items-center p-0">
                                        <img className="foot-ball-img" src="/image/football-ball.png" alt="" />
                                    </div>
                                    <div className="col-6 p-0">
                                        <div className="row img-text">
                                            Голы
                                        </div>
                                        <div className="row img-number align-items-start">
                                            {isEditMode ? <input type="text"
                                                placeholder={profileInfo.goalsQnt}
                                                value={changeStat.goalsQnt}
                                                className="admin-edit"
                                                onChange={(event) => setChangeStat({ ...changeStat, goalsQnt: event.target.value })}
                                            />
                                                : profileInfo.goalsQnt}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3 p-0">
                                <div className="row m-0">
                                    <div className="col-6 d-flex align-items-center p-0">
                                        <img className="foot-assist-img" src="/image/football-assist.png" alt="" />
                                    </div>
                                    <div className="col-6 p-0">
                                        <div className="row img-text">
                                            Передачи
                                        </div>
                                        <div className="row img-number align-items-start">
                                            {isEditMode ? <input type="text"
                                                placeholder={profileInfo.assistsQnt}
                                                value={changeStat.assistsQnt}
                                                className="admin-edit"
                                                onChange={(event) => setChangeStat({ ...changeStat, assistsQnt: event.target.value })}
                                            />
                                                : profileInfo.assistsQnt}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 p-0 m-0 h-100">
                        {getStatusTitle()}
                        <div className="row profile-button-wrap">
                            <input type="button"
                                value="Матчи"
                                className="profile-button"
                                onClick={() => navigate(location.pathname + TO_USER_GAMES_PROFILE)}
                            />
                        </div>
                        <div className="row profile-button-wrap">
                            {getEditModeButton()}
                        </div>
                        <div className="row profile-button-wrap">
                            {getBlockButton()}
                        </div>
                        <div className="row profile-button-wrap">
                            <select className="player-selected"
                                onChange={(event) => setCurrentContainer(event.target.value)}
                            >
                                <option value='1' selected >Сообщения</option>
                                <option value='2'>Жалобы</option>
                                <option value='3'>Блокировки</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row profile-comment-container">
                    <div className="col p-0">
                        <div className="row comment-view-container" ref={commentContainer}>
                            <div className="col p-0 some-col">
                                {selectInfoContainer()}
                            </div>
                        </div>
                        <div className="row comment-send-container">
                            <div className="container-number">Количество: {number}</div>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}
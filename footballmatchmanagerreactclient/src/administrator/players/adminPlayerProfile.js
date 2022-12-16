import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./../../css/profile.css";
import AdminPlayers from "./adminPlayers";
//import UserCommentBlock from "./usercommentblock";

export default function AdminPlayerProfile(props) {

    const [profileInfo, setProfileInfo] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const[userStat, setUserStat] = useState({
        matches: "",
        goals: "",
        assists: ""
    });

    useEffect(
        () => {

            axios.get('https://localhost:7277/api/admin/profile/user/' + props.apUserId, { withCredentials: true })
                .then((response) => {
                    setProfileInfo(response.data);
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
            ;
        }, []
    );

    function makeAdmin() {

        const data = new FormData();
        data.append("userId", profileInfo.apUserId);

        axios.post('https://localhost:7277/api/admin/profile/makeadmin/', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
                toast.success('Пользователю назначена роль "Администратор"',
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            })
    }

    function makeUser() {
        const data = new FormData();
        data.append("userId", profileInfo.apUserId);

        axios.post('https://localhost:7277/api/admin/profile/makeuser/', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
                toast.success('Пользователю назначена роль "Пользователь"',
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            })
    }

    function blockUser() {
        const data = new FormData();
        data.append("userId", profileInfo.apUserId);

        axios.put('https://localhost:7277/api/admin/profile/blockuser/', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
                toast.success("Пользователь заблокирован",
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            })

    }

    function unBlockUser() {
        const data = new FormData();
        data.append("userId", profileInfo.apUserId);

        axios.put('https://localhost:7277/api/admin/profile/unblockuser/', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
                toast.success("Пользователь разблокирован",
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            })
    }

    function saveChanges()
    {

        /*Валидация*/

        setIsEdit(false);


        const data = new FormData();
        data.append("userId", profileInfo.apUserId);
        data.append("gamesNumber", userStat.matches);
        data.append("goalsNumber", userStat.goals);
        data.append("goalsAssists", userStat.assists);

        axios.put('https://localhost:7277/api/admin/profile/updateuser/', data, { withCredentials: true })
        .then((response) => {
            setProfileInfo(response.data);
            toast.success("Данные успешно сохранены",
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
        })

    }

    function deleteUser()
    {

        const data = new FormData();
        data.append("userId", profileInfo.apUserId);

        axios.delete('https://localhost:7277/api/admin/profile/deleteuser/' + profileInfo.apUserId, { withCredentials: true })
        .then((response) => {
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
                props.setPlayers(response.data.users);
                props.setContState(<AdminPlayers setContState={props.setContState} />);    
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

    function edit()
    {
        setUserStat({
            matches: profileInfo.gamesNumber,
            goals: profileInfo.goalsNumber,
            assists: profileInfo.assistsNumber                                        
        }); 
        setIsEdit(true);
    }

    /*
    const userComment = [
        {
            commentUserImg: "/image/default-profile-icon.jpg",
            commentUserName: "Евгений Шедько",
            commentDate: "11.12.2022 15:00",
            commentText: "Жека, ты крутой1!" 
        },

        {
            commentUserImg: "/image/default-profile-icon.jpg",
            commentUserName: "Евгений Шедько",
            commentDate: "11.12.2022 15:00",
            commentText: "Жека, ты крутой2!"             
        },

        {
            commentUserImg: "/image/default-profile-icon.jpg",
            commentUserName: "Евгений Шедько",
            commentDate: "11.12.2022 15:00",
            commentText: "Жека, ты крутой3!" 
        },

        {
            commentUserImg: "/image/default-profile-icon.jpg",
            commentUserName: "Евгений Шедько",
            commentDate: "11.12.2022 15:00",
            commentText: "Жека, ты крутой4!" 
        }
    ]
    */

    return (
        <div className="row profile-container">
            <div className="row profile-info-container m-0">
                <div className="col-3 d-flex justify-content-center p-0">
                    <img className="profile-image" src="/image/default-profile-icon.jpg" alt="" />
                </div>
                <div className="col-6 p-0">
                    <div className="row prtext pruser-name">
                        {profileInfo.userFirstName + ' ' + profileInfo.userLastName}
                    </div>
                    <div className="row prtext">
                        Дата рождения: {(new Date(profileInfo.userDateOfBirth)).toLocaleString().substring(0, (new Date(profileInfo.userDateOfBirth)).toLocaleString().length - 10)}
                    </div>
                    <div className="row prtext">
                        Позиция: {profileInfo.userPosition}
                    </div>
                    {/*пока что будет выводить email*/}
                    <div className="row prtext">
                        Email: {profileInfo.userEmail}
                    </div>
                    <div className="row icon-row">
                        <div className="col-4 p-0">
                            <div className="row">
                                <div className="col-4 p-0">
                                    <img className="foot-field-img" src="/image/soccer-field.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Игры
                                    </div>
                                    <div className="row img-number align-items-start">
                                        {isEdit ? <input type="text"
                                                          placeholder={userStat.matches}  
                                                          value={userStat.matches}
                                                          className="admin-edit" 
                                                          onChange={(e) => setUserStat( {...userStat, matches:e.target.value})}/> : profileInfo.gamesNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 p-0">
                            <div className="row m-0">
                                <div className="col-4 d-flex align-items-center p-0">
                                    <img className="foot-ball-img" src="/image/football-ball.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Голы
                                    </div>
                                    <div className="row img-number align-items-start">
                                        {isEdit ? <input type="text" 
                                                         placeholder={userStat.goals} 
                                                         className="admin-edit" 
                                                         value={userStat.goals}
                                                         onChange={(e) => setUserStat( {...userStat, goals:e.target.value})} /> : profileInfo.goalsNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 p-0">
                            <div className="row m-0">
                                <div className="col-4 d-flex align-items-center p-0">
                                    <img className="foot-assist-img" src="/image/football-assist.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Передачи
                                    </div>
                                    <div className="row img-number align-items-start">
                                        {isEdit ? <input type="text" 
                                                         placeholder={userStat.assists} 
                                                         value={userStat.assists} 
                                                         onChange={(e) => setUserStat( {...userStat, assists:e.target.value})} className="admin-edit"/> : profileInfo.assistsNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="row user-type">
                        {profileInfo.userRole === 'user' ? 'Пользователь' : 'Администратор'}
                    </div>
                    <div className="row user-type">
                        {profileInfo.userStatus === 'block' ? 'Заблокирован' : ''}
                    </div>
                    <div className="row admin-button">
                        <input className="just-button" type="button" value="Редактировать" onClick={edit} />
                    </div>
                    <div className="row admin-button">
                        {profileInfo.userRole === 'user' ? <input className="just-button" type="button" value="Сделать администратором" onClick={makeAdmin} /> : <input className="just-button" type="button" value="Сделать пользователем" onClick={makeUser} />}
                    </div>
                    <div className="row admin-button danger-button">
                        {profileInfo.userStatus === 'block' ? <input className="just-button" type="button" value="Разблокировать" onClick={unBlockUser} /> : <input className="danger-button" type="button" value="Заблокировать" onClick={blockUser} />}
                    </div>
                    <div className="row admin-button">
                        <input className="danger-button" 
                               type="button" 
                               value="Удалить" 
                               onClick={deleteUser} />
                    </div>
                    <div className="row admin-button">
                        <input className="save-button" type="button" value="Сохранить" onClick={saveChanges} />
                    </div>
                    <div className="row admin-button">
                        {isEdit ? <input className="danger-button" type="button" value="Отмена" onClick={() => setIsEdit(false)} /> : ''}
                    </div>                                        
                </div>
            </div>
            {/*
            <div className="row profile-comment-container">
                <div className="col p-0">
                    <div className="row comment-view-container">
                        <div className="col p-0 some-col">
                            Формирутеся автоматически
                            Плохой перенос текста в коммнетарии пользователя
                            {userComment.map((comment) => <UserCommentBlock  commentInfo={comment}/>)}                            
                        </div>
                    </div>
                    <div className="row comment-send-container">
                        <div className="col-10 comment-send-area">
                            <input className="comment-enter-button" type="text" placeholder="Оставьте комментарий..." />
                        </div>
                        <div className="col-2 p-0">
                            <input className="comment-send-button" value="Отправить" type="button"/>
                        </div>
                    </div>
                </div>
            </div>
            */}
        </div>
    );
}
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../../css/profile.css"
import UserCommentBlock from "./usercommentblock";
import "react-datepicker/dist/react-datepicker.css";
import EditProfile from "./EditProfile";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {Context} from "./../../index";

export default function Profile(props) {

    /*Проблема рендера несколько раз*/
    const {user} = useContext(Context);
    const [userId, setUserId] = useState(props.apUserId);
    const [profileInfo, setProfileInfo] = useState({});
    const [changes, setChanges] = useState({
        userFirstName: "",
        userLastName: "",
        userDateBirth: new Date(),
        userPosition: "",
        userEmail: ""
    });
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const[currMes, setCurrMes] = useState("");
    const[connection, setConnection] = useState({});
    const[userComment, setUserComment] = useState([]);

    useEffect(() => {

        const data = new FormData();
        data.append("userId", userId);

        axios.post('https://localhost:7277/api/profile/userprofile', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
                console.log("profile" + response.data.apUserId);
            })
            .then(() => {
                axios.get('https://localhost:7277/api/profile/allcomments/' + userId,{ withCredentials: true })
                .then((response) => {
                    setUserComment(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error("Не удалось получить комментарии профиля",
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
                    toast.error("Ошибка получения профиля",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

            const hubConnection = new HubConnectionBuilder().withUrl("https://localhost:7277/commentchat").build();
            
            hubConnection.on("Send", (commentUserName, commentDate, commentText, userSender, commentId) => {
                setUserComment(userComment => [...userComment, {commentUserName, commentDate, commentText, userSender, commentId}]);
            });                
            hubConnection.start();
            setConnection(hubConnection);
    }, []
    );

    function edit() {
        setChanges({
            userFirstName: profileInfo.userFirstName,
            userLastName: profileInfo.userLastName,
            userDateBirth: new Date(profileInfo.userDateOfBirth),
            userPosition: profileInfo.userPosition,
            userEmail: profileInfo.userEmail
        });
        setEditProfileVisible(true)
    }

    function sendMessage()
    {
        /*Сначала нужно отправить запрос и получить обратно*/
        const data = new FormData();
        data.append("CommentText", currMes);
        data.append("CommentRecipient", userId);
        data.append("CommentSender", user.getUserId);

        axios.post('https://localhost:7277/api/profile/addcomment', data, { withCredentials: true })
            .then((response) => {
                /*
                connection.invoke("Send", user.getUserName, 
                                          response.data.commentDateTime, 
                                          response.data.commentText, 
                                          String(response.data.commentRecipient), 
                                          String(response.data.commentSender),
                                          String(response.data.commentId)                                          
                                          );
                */                          
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error("Ошибка отправки комментария",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

        setCurrMes("");
    }

    return (
        <div className="row profile-container">
            <div className="row profile-info-container m-0">
                <div className="col-3 d-flex justify-content-center p-0">
                    <img className="profile-image" src="/image/default-profile-icon.jpg" alt="" />
                </div>
                <div className="col-7 p-0 h-100">
                    <div className="row pruser-name">
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
                    {/*Пока что стат, нет полей в бд*/}
                    <div className="row icon-row">
                        <div className="col-3 p-0">
                            <div className="row">
                                <div className="col-6 p-0">
                                    <img className="foot-field-img" src="/image/soccer-field.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Игры
                                    </div>
                                    <div className="row img-number align-items-start">
                                        {profileInfo.gamesNumber}
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
                                        {profileInfo.goalsNumber}
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
                                        {profileInfo.assistsNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 p-0 h-100">
                    <div className="row m-0 admin-button">
                        <input type="button"
                            value="Изменить"
                            className="just-button"
                            onClick={edit} />
                    </div>
                </div>
            </div>
            <div className="row profile-comment-container">
                <div className="col p-0">
                    <div className="row comment-view-container">
                        <div className="col p-0 some-col">
                            {userComment.map((comment) => <UserCommentBlock commentInfo={comment}
                                                                            userprif={userId}
                                                                            setUserComment={setUserComment}
                                                                            />)}
                        </div>
                    </div>
                    <div className="row comment-send-container">
                        <div className="col-10 comment-send-area">
                            <input className="comment-enter-button" 
                                   type="text" 
                                   placeholder="Оставьте комментарий..."
                                   value={currMes} 
                                   onChange={(e) => setCurrMes(e.target.value)}/>
                        </div>
                        <div className="col-2 p-0">
                            <input className="comment-send-button" 
                                   value="Отправить" 
                                   type="button" 
                                   onClick={sendMessage}
                                   />
                        </div>
                    </div>
                </div>
            </div>
            {/*Еще нужно передать состояние на сам профиль*/}
            <EditProfile setProfileInfo={setProfileInfo}
                info={changes}
                setInfo={setChanges}
                show={editProfileVisible}
                onHide={setEditProfileVisible} />
        </div>
    );
}
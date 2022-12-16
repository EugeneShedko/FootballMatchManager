import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./../../css/profile.css"
import UserCommentBlock from "./usercommentblock";

export default function Profile(props) {

    /*Проблема рендера несколько раз*/
    const[userId, setUserId] = useState(props.apUserId);
    const[profileInfo, setProfileInfo] = useState({});

    useEffect(() => {

            console.log("profile" + userId);

            const data = new FormData();
            data.append("userId", userId);

            axios.post('https://localhost:7277/api/profile/userprofile', data, { withCredentials: true })
                .then((response) => {
                    setProfileInfo(response.data);
                    console.log(response.data);
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
            ;
        }, []
    );

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
                <div className="col-9 p-0">
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
                    {/*Пока что стат, нет полей в бд*/}
                    <div className="row icon-row">
                        <div className="col-2 p-0">
                            <div className="row">
                                <div className="col-6 p-0">
                                    <img className="foot-field-img" src="/image/soccer-field.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Игры
                                    </div>
                                    <div className="row img-number align-items-start">
                                        22
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-2 p-0">
                            <div className="row m-0">
                                <div className="col-6 d-flex align-items-center p-0">
                                    <img className="foot-ball-img" src="/image/football-ball.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Голы
                                    </div>
                                    <div className="row img-number align-items-start">
                                        22
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-2 p-0">
                            <div className="row m-0">
                                <div className="col-6 d-flex align-items-center p-0">
                                    <img className="foot-assist-img" src="/image/football-assist.png" alt="" />
                                </div>
                                <div className="col-6 p-0">
                                    <div className="row img-text">
                                        Передачи
                                    </div>
                                    <div className="row img-number align-items-start">
                                        22
                                    </div>
                                </div>
                            </div>
                        </div>
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
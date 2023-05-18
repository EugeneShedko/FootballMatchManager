import axios from "axios";
import { useContext, useEffect, useState, useRef, } from "react";
import { toast } from "react-toastify";
import UserCommentBlock from "./UserCommentBlock";
import EditProfile from "./EditProfile";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Context } from "../../../../index";

import "./../../../../css/PlayerCard.css";
import "react-datepicker/dist/react-datepicker.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_EDIT_PROFILE } from "../../../../Utilts/Consts";

export default function PlayerCardAdmin() {

    const navigate = useNavigate();
    const location = useLocation();

    const { userContext } = useContext(Context);
    const [userId, setUserId] = useState(parseInt(useParams().id));
    const [profileInfo, setProfileInfo] = useState({});
    const [changes, setChanges] = useState({
        userFirstName: "",
        userLastName: "",
        userDateBirth: new Date(),
        userPosition: "",
        userEmail: "",
    });
    const [currMes, setCurrMes] = useState("");
    const connection = useRef(null);
    const [userComment, setUserComment] = useState([]);
    const commentContainer = useRef(null);

    // ------------------------------------------------------------------------------------------------ //

    useEffect(() => {
        const data = new FormData();
        data.append("userId", userId);

        axios.post('http://localhost:5004/api/profile/user-card', data, { withCredentials: true })
            .then((response) => {
                setProfileInfo(response.data);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/comment/user-card-comment/' + userId, { withCredentials: true })
                    .then((response) => {
                        setUserComment(response.data);
                    })
                    .catch(userError => {
                        if (userError.response) {
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
    
        return () => {
            if (connection.current) {
              connection.current.stop();
            }
          };

    }, [location.state && location.state.refresh]);

    // ---------------- Скролл  ------------------------------------------- //

    useEffect(() => {
        commentContainer.current.scrollTop = commentContainer.current.scrollHeight;
    }, [userComment]);

    // ------------------------------------------------------------------------------------------------ //

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
                    {/*пока что будет выводить email*/}
                    <div className="row prtext">
                        Email: {profileInfo.email}
                    </div>
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
                                        {profileInfo.gamesQnt}
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
                                        {profileInfo.goalsQnt}
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
                                        {profileInfo.assistsQnt}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 p-0 m-0 h-100">
                    <div className="row m-0 admin-button">
                        {
                            /* Кнопки администратора в данном месте должны находиться */
                        }
                    </div>
                </div>
            </div>
            <div className="row profile-comment-container">
                <div className="col p-0">
                    <div className="row comment-view-container" ref = {commentContainer}>
                        <div className="col p-0 some-col">
                            {
                                userComment.map((comment) => <UserCommentBlock commentInfo={comment}
                                    userprif={userId}
                                    setUserComment={setUserComment}
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}
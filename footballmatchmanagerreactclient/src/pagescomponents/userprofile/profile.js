import "./../../css/profile.css"
import UserCommentBlock from "./usercommentblock";

export default function Profile() {

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

    return (
        <div className="row profile-container">
            <div className="row profile-info-container m-0">
                <div className="col-3 d-flex justify-content-center p-0">
                    <img className="profile-image" src="/image/default-profile-icon.jpg" alt="" />
                </div>
                <div className="col-9 p-0">
                    <div className="row prtext pruser-name">
                        Шедько Евгений Александрович
                    </div>
                    <div className="row prtext">
                        Дата рождения: 18.05.2002
                    </div>
                    <div className="row prtext">
                        Позиция: Нападающий
                    </div>
                    <div className="row prtext">
                        Команда: Манчестер Юнайтед
                    </div>
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
            <div className="row profile-comment-container">
                <div className="col p-0">
                    <div className="row comment-view-container">
                        <div className="col p-0 some-col">
                            {/*Формирутеся автоматически*/}
                            {/*Плохой перенос текста в коммнетарии пользователя*/}
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
        </div>
    );
}
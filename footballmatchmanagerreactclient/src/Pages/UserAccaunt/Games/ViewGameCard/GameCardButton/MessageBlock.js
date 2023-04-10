import { useContext } from "react";
import { Context } from "./../../../../../index";
import "./../../../../../css/Message.css";

export default function MessageBlock(props) {

    const { user } = useContext(Context);
    /* Нужно добавить переменную пользователя и айди отправитля на сервере */

    const userNameStyle = props.messageInfo.senderId === user.getUserId ? "row mess-owner-name" : "row m-0";

    return (
        <div className="message-container">
            <div className="message-back-block" />
            <div className="row message-block-content h-100">
                <div className="col-3">
                    <img id="message-profile-image" 
                         src={"http://localhost:5004/" + props.messageInfo.image}  
                         alt="" />
                </div>
                <div className="col-9 message-block-column h-100">
                    <div className={userNameStyle}>
                        {props.messageInfo.userName}
                    </div>
                    <div className="row m-0 message-text text-wrap">
                        {props.messageInfo.text}
                    </div>
                </div>
            </div>
        </div>
    );
}

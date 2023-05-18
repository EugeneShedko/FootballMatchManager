import { useContext } from "react";
import { Context } from "./../../../../../index";
import "./../../../../../css/Message.css";

export default function MessageBlock(props) {

    const { userContext } = useContext(Context);
    const userNameStyle = props.messageInfo.senderId === userContext.userId ? "row mess-owner-name" : "row m-0";

    return (
        <div className="message-container">
            <div className="message-back-block" />
            <div className="row m-0 p-0">
                <div className="col message-block-content">
                    <div className="row mess-date-row">
                        {(new Date(props.messageInfo.date)).toLocaleString().substring(0, (new Date(props.messageInfo.date)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-3">
                            <img id="message-profile-image"
                                src={"http://localhost:5004/" + props.messageInfo.image}
                                alt="" />
                        </div>
                        <div className="col-9 message-block-column h-100">
                            <div className={userNameStyle}>
                                {props.messageInfo.userName}
                            </div>
                            <div className="row message-text text-wrap">
                                {props.messageInfo.text}
                            </div>
                        </div>
                    </div>
                </div>
                {userContext.isAdmin ?
                    <div className="row m-0 p-0">
                        <input name="invitebutton"
                            className="delete-user-button"
                            type="button"
                            value="Удалить"
                            onClick={() => props.deleteMessage(props.messageInfo.pkId)}
                        />
                    </div>
                    : null}
            </div>
        </div>
    );
}

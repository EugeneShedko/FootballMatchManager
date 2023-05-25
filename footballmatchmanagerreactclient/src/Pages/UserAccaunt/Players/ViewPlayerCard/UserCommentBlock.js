import { useContext } from "react";
import { Context } from "../../../../index";

import "./../../../../css/CommentBlock.css";

export default function UserCommentBlock(props) {

    const { userContext } = useContext(Context);
    const userNameStyle = props.commentInfo.senderId === userContext.userId ? "row user-comment-name comment-name-owner" : "row user-comment-name";

    // --------------------------------------------------------------------------------------------------------------------------- //

    return (
        <div className="row user-comment-container">
            <div className="col-1 d-flex justify-content-center p-0">
                <img className="user-comment-img"
                    src={"http://localhost:5004/" + props.commentInfo.image}
                    alt="" />
            </div>
            <div className="col-9 p-0 m-0">
                <div className={userNameStyle}>
                    <div className="row m-0 p-0">
                        {props.commentInfo.userName}
                    </div>
                    <div className="row user-comment-text">
                        {props.commentInfo.text}
                    </div>
                </div>
            </div>
            <div className="col-2 prof-r-col">
                <div className="row comment-date">
                    {(new Date(props.commentInfo.date)).toLocaleString().substring(0, (new Date(props.commentInfo.date)).toLocaleString().length - 3)}
                </div>
                {userContext.isAdmin ?
                    <div className="row m-0 p-0">
                        <input type="button"
                            value="Удалить"
                            className="delete-comment-button"
                            onClick={() => props.deleteComment(props.commentInfo.pkId)}
                        />
                    </div>
                    : null}
            </div>
        </div >
    );
}
import "./../../css/usercommentblock.css"

export default function UserCommentBlock(props) {
    return (
        <div className="row user-comment-container">
        <div className="col-1 d-flex justify-content-center p-0">
            <img className="user-comment-img" src={props.commentInfo.commentUserImg} alt="" />
        </div>
        <div className="col-11 p-0">
            <div className="row user-comment-name">
                <div className="col-10 p-0">
                    {props.commentInfo.commentUserName}
                </div>
                <div className="col-2 d-flex justify-content-end p-0">
                    {props.commentInfo.commentDate}
                </div>
            </div>
            <div className="row user-comment-text">
                {props.commentInfo.commentText}
            </div>
        </div>
    </div>
    );
}
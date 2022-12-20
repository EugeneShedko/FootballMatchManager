import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import "./../../css/usercommentblock.css";
import {Context} from "./../../index";

export default function UserCommentBlock(props) {

    const {user} = useContext(Context);

    function deleteComment()
    {
        axios.delete('https://localhost:7277/api/profile/deletecomment/' + props.commentInfo.commentId, { withCredentials: true })
        .then((response) => {
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
        })
        .then(() => {
            axios.get('https://localhost:7277/api/profile/allcomments/' + props.userprif,{ withCredentials: true })
            .then((response) => {
                props.setUserComment(response.data);
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

    return (
        <div className="row user-comment-container">
            <div className="col-1 d-flex justify-content-center p-0">
                <img className="user-comment-img" src="/image/default-profile-icon.jpg" alt="" />
            </div>
            <div className="col-11 p-0">
                <div className="row user-comment-name">
                    <div className="col-10 p-0">
                        {props.commentInfo.commentUserName}
                    </div>
                    <div className="col-2 p-0">
                        <div className="row m-0">
                            {(new Date(props.commentInfo.commentDate)).toLocaleString().substring(0, (new Date(props.commentInfo.commentDate)).toLocaleString().length - 3)}
                        </div>
                        <div className="row m-0">
                            {props.commentInfo.userSender == user.getUserId ?
                            <input type="button" 
                                   value="Удалить" 
                                   className="c-danger-button"
                                   onClick={deleteComment} />
                                   : null}
                        </div>
                    </div>
                </div>
                <div className="row user-comment-text">
                    {props.commentInfo.commentText}
                </div>
            </div>
        </div>
    );
}
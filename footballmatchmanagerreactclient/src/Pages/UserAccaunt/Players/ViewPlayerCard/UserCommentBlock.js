import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import {Context} from "../../../../index";

import "./../../../../css/CommentBlock.css";

export default function UserCommentBlock(props) {

    const {user} = useContext(Context);
    const userNameStyle = props.commentInfo.senderId === user.getUserId ? "row user-comment-name comment-name-owner": "row user-comment-name";

    // --------------------------------------------------------------------------------------------------------------------------- //

    /*
    function deleteComment()
    {
        axios.delete('http://localhost:5004/api/profile/deletecomment/' + props.commentInfo.commentId, { withCredentials: true })
        .then((response) => {
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
        })
        .then(() => {
            axios.get('http://localhost:5004/api/profile/allcomments/' + props.userprif,{ withCredentials: true })
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
        //Странно работают комментарии
        props.updateComments();
    }
    */

    // --------------------------------------------------------------------------------------------------------------------------- //

    return (
        <div className="row user-comment-container">
            <div className="col-1 d-flex justify-content-center p-0">
                <img className="user-comment-img" 
                     src={"http://localhost:5004/" + props.commentInfo.image}  
                     alt="" />
            </div>
            <div className="col-11 p-0">
                <div className={userNameStyle}>
                    <div className="col-10 p-0">
                        {props.commentInfo.userName}
                    </div>
                    <div className="col-2 p-0">
                        <div className="row m-0">
                            {(new Date(props.commentInfo.date)).toLocaleString().substring(0, (new Date(props.commentInfo.date)).toLocaleString().length - 3)}
                        </div>
                        {/*
                        <div className="row m-0">
                            {props.commentInfo.userSender == user.getUserId ?
                            <input type="button" 
                                   value="Удалить" 
                                   className="c-danger-button"
                                   onClick={deleteComment} />
                                   : null}
                        </div>
                        */}
                    </div>
                </div>
                <div className="row user-comment-text">
                    {props.commentInfo.text}
                </div>
            </div>
        </div>
    );
}
import { useContext } from "react";
import { Context } from "../../../../index";

import "./../../../../css/CommentBlock.css";

export default function UserComplainBlock(props)
{
    return (
        <div className="row user-comment-container">
            <div className="col-1 d-flex justify-content-center p-0">
                <img className="user-comment-img"
                    src={"http://localhost:5004/" + props.complainInfo.recipient.image}
                    alt="" />
            </div>
            <div className="col-9 p-0 m-0">
                <div>
                    <div className="row m-0 p-0" style={{color: 'yellowgreen'}}>
                        {props.complainInfo.recipient.firstName + ' ' + props.complainInfo.recipient.lastName}
                    </div>
                    <div className="row user-comment-text">
                        {props.complainInfo.text}
                    </div>
                </div>
            </div>
            <div className="col-2 prof-r-col">
                <div className="row comment-date">
                    {(new Date(props.complainInfo.date)).toLocaleString().substring(0, (new Date(props.complainInfo.date)).toLocaleString().length - 3)}
                </div>
            </div>
        </div >
    );
}
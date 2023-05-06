import "./../../../../css/Player.css"
import Profile from "../ViewPlayerCard/PlayerCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TO_GAME_INVITE, TO_PLAYER_CARD } from "../../../../Utilts/Consts";
import { useContext, useState } from "react";
import { Context } from "../../../..";

export default function PlayerBlock(props) {

    const navigate = useNavigate();
    /* Находимся ли мы на странице приглашения матча */
    const [isInvite, setIsInvite] = useState(useLocation().pathname.includes(TO_GAME_INVITE) ? true : false);
    const [gameId, setGameId] = useState(parseInt(useParams().id));
    const {userContext} = useContext(Context);

    // ----------------------------------------------------------------------------- //

    function setPlayerInfoPage(event) {

        if(event.target.name !== 'invitebutton')
           navigate(TO_PLAYER_CARD + '/' + props.info.pkId);
    }

    // ----------------------------------------------------------------------------- //

    function sendInviteToAddGame(event)
    {

        var conn = userContext.notificonn;
        conn.invoke("InvitationToGame", props.info.pkId, gameId);
    }

    // ----------------------------------------------------------------------------- //

    return (
        <div name="player-container" className="player-container" onClick={e => setPlayerInfoPage(e)}>
            <div className="player-back-block" />
            <div className="row player-block-content">
                <div className="col-5">
                    <img id="profile-image"
                        src={"http://localhost:5004/" + props.info.image}
                        alt="" />
                </div>
                <div className="col-7 player-block-column">
                    <div className="row m-0">
                        {props.info.firstName + ' ' + props.info.lastName}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.birth)).toLocaleString().substring(0, (new Date(props.info.birth)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {props.info.position}
                    </div>
                    <div className="row m-0">
                        {props.info.email}
                    </div>
                </div>
            </div>
            {
                isInvite ?
                    <div className="row m-0 p-0">
                        <input name="invitebutton"
                               className="invite-button"
                               type="button"
                               value="Пригласить"
                               onClick={e => sendInviteToAddGame(e)}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );
}
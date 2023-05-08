import { useLocation, useNavigate } from "react-router-dom";
import TeamInfoPage from "../ViewTeamCard/TeamInfoCard";

import "./../../../../css/Teams/TeamBlock.css";
import { TO_TEAM_CARD, TO_TEAM_GAME_INVITE_CARD } from "../../../../Utilts/Consts";
import { useState } from "react";

export default function TeamBlock(props) {

    const navigate = useNavigate();
    /* Находимся ли мы на странице приглашения матча */
    const [isInvite, setIsInvite] = useState(useLocation().pathname.includes(TO_TEAM_GAME_INVITE_CARD) ? true : false);

    // ------------------------------------------------------------------- //

    function setTeamInfoPage(event) {
        if (event.target.name !== 'invitebutton')
            navigate(TO_TEAM_CARD + '/' + props.info.pkId);
    }

    // ------------------------------------------------------------------- //

    return (
        <div className="team-container" onClick={setTeamInfoPage}>
            <div className="team-back-block" />
            <div className="row team-block-content">
                <div className="col-5 team-block-column">
                    <div className="row m-0">
                        <img className="team-block-image"
                            src={"http://localhost:5004/" + props.info.image}
                            alt="" />
                    </div>
                </div>
                <div className="col-7 team-block-column">
                    <div className="row m-0">
                        {props.info.name}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.crtDate)).toLocaleString().substring(0, (new Date(props.info.crtDate)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        Участников: {props.info.memberQnt}
                    </div>
                </div>
            </div>
            {
                isInvite ?
                    <div className="row invite-button-cont">
                        {
                            props.isVisable ?
                                <input name="invitebutton"
                                    className="invite-button"
                                    type="button"
                                    value="Пригласить"
                                    onClick={() => props.sendInviteToAddTeamGame(props.info.pkId)}
                                />
                                :
                                <> Приглашение отправлено </>
                        }
                    </div>
                    :
                    null
            }
        </div>
    );
}
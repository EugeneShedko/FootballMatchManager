import "./../../../../css/Player.css"
import { useLocation, useNavigate } from "react-router-dom";
import { TO_GAME_INVITE, TO_PLAYER_CARD, TO_TEAM_CARD, TO_USER_TEAMS } from "../../../../Utilts/Consts";
import { useContext, useState } from "react";
import { TO_GAME_CARD } from "../../../../Utilts/Consts";
import { Context } from "../../../..";

export default function PlayerBlock(props) {

    const { userContext } = useContext(Context);
    const navigate = useNavigate();
    /* Находимся ли мы на странице приглашения матча */
    const [isInvite, setIsInvite] = useState(useLocation().pathname.includes(TO_GAME_INVITE) ? true : false);
    /* Отображаени кнопки удаления пользователя из матча */
    const [isDisplayDelButton, setIsDisplayDelButton] = useState(
        useLocation().pathname.includes(TO_GAME_CARD)
        /* Не карточка приглашения */
        && isInvite === false
        /* Является организатором матча */
        &&
        (props.isCreat === true || userContext.isAdmin === true)
        /* Блок пользователя не блок организатора матча */
        && props.gameCreatroId !== props.info.pkId
        ? true : false);
    /* Отображение кнопки удаления пользователя из команды */
    /* Пока что такое отображение */
    const [locatinPath, setLocationPath] = useState(useLocation().pathname);
    const [isDisplayDelTeamButton, setIsDisplayDelTeamButton] = useState(
        (locatinPath.includes(TO_USER_TEAMS) || locatinPath.includes(TO_TEAM_CARD))
            && (props.isCreat === true || userContext.isAdmin === true)
            /* Здесь нужно айди организатора команды !!! */
            && props.teamCreatorId !== props.info.pkId ? true : false);

    // ----------------------------------------------------------------------------- //

    function setPlayerInfoPage(event) {

        if (event.target.name !== 'invitebutton')
            navigate(TO_PLAYER_CARD + '/' + props.info.pkId);
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
            {/* Кнопка приглашения пользователя в индивидуальный матч */}
            {
                isInvite ?
                    <div className="row invite-button-cont">
                        {
                            props.isVisable ?
                                <input name="invitebutton"
                                    className="invite-button"
                                    type="button"
                                    value="Пригласить"
                                    onClick={e => props.sendInviteToAddGame(props.info.pkId)}
                                />
                                :
                                <> Приглашение отправлено </>
                        }
                    </div>
                    :
                    null
            }
            {/* Кнопка удаления пользователя из индивидуального матча */}
            {
                isDisplayDelButton ?
                    <div className="row m-0 p-0">
                        <input name="invitebutton"
                            className="delete-user-button"
                            type="button"
                            value="Удалить"
                            onClick={() => props.deleteUser(props.info.pkId)}
                        />
                    </div>
                    : null
            }
            {/* Кнопка удаления пользователя из команды */}
            {
                isDisplayDelTeamButton ?
                    <div className="row m-0 p-0">
                        <input name="invitebutton"
                            className="delete-user-button"
                            type="button"
                            value="Удалить"
                            onClick={() => props.deleteUserTeam(props.info.pkId)}
                        />
                    </div>
                    : null
            }
        </div>
    );
}
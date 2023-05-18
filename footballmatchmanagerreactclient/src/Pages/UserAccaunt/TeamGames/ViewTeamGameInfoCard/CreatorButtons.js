import { useLocation, useNavigate } from "react-router-dom";
import { TO_TEAM_GAME_HISTORY, TO_TEAM_GAME_INVITE_CARD } from "../../../../Utilts/Consts";

export default function CreatorButtons(props) {

    const navigate = useNavigate();
    const location = useLocation();

    // -------------------------------------------------------------- //

    function selectButtons(gameStatus) {

        switch (gameStatus) {
            case 0: return <>
                <InviteTeam />
                <EditTeamGame />
                <DeleteTeamGame />
            </>;
            case 1: return <>
                <EditTeamGame />
                <DeleteTeamGame />
            </>;
            case 2: return <FinishGame />;
            case 3: return <></>;
            default: return <></>;
        }
    }

    // -------------------- Кнопка удаления матча ---------------------- //

    function DeleteTeamGame() {
        return (
            <input className="team-delete-button"
                type="button"
                value="Удалить"
                onClick={props.deleteTeamGame}
            />
        );

    }

    // -------------------- Кнопка редактирования матча ---------------------- //

    function EditTeamGame() {
        return (
            <input className="team-join-button"
                type="button"
                value="Редактировать"
            onClick={props.editTeamGame}
            />
        );
    }

    // -------------------------------------------------------------- //

    function FinishGame() {

        return (
            <input className="team-join-button"
                type="button"
                value="Завершить матч"
                onClick={() => navigate(location.pathname + TO_TEAM_GAME_HISTORY)}
            />
        );
    }

    // --------------- Кнопка приглашения команд на матч ------------------ //

    function InviteTeam() {
        return (
            <input className="team-join-button"
                type="button"
                value="Пригласить команду"
                onClick={() => navigate(location.pathname + TO_TEAM_GAME_INVITE_CARD)}
            />
        );
    }

    // -------------------------------------------------------------- //

    return (
        <>
            {selectButtons(props.game.status)}
        </>
    );
}
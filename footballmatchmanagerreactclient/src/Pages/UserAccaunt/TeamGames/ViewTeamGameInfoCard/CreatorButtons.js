import { useLocation, useNavigate } from "react-router-dom";
import { TO_TEAM_GAME_HISTORY, TO_TEAM_GAME_INVITE_CARD } from "../../../../Utilts/Consts";

export default function CreatorButtons(props) {

    const navigate = useNavigate();
    const location = useLocation();

    // -------------------------------------------------------------- //

    function selectButtons(gameStatus) {
        
        switch (gameStatus) 
        {
            case 0: return <InviteTeam />;
            case 2: return <FinishGame />;
            /* Пока что такие кнопки возвращаются у органиазатора матча */
            case 3: return <></>;
            default: return <></>;
        }
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

    function InviteTeam()
    {
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
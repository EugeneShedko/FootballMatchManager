import { useLocation, useNavigate } from "react-router-dom";
import { TO_TEAM_GAME_HISTORY } from "../../../../Utilts/Consts";

export default function CreatorButtons(props) {

    const navigate = useNavigate();
    const location = useLocation();

    // -------------------------------------------------------------- //

    function selectButtons(gameStatus) {
        
        switch (gameStatus) {
            case 2: return <FinishGame />;break;
            default: return <></>;break;
        }
    }

    // -------------------------------------------------------------- //

    /* Нужно еще как-то передать параметры */
    /* Не понятно правда, как это сделать*/

    function FinishGame() {
        
        return (
            <input className="team-join-button"
                   type="button"
                   value="Зварешить матч"
                   onClick={() => navigate(location.pathname + TO_TEAM_GAME_HISTORY)}
            />
        );
    }

    // -------------------------------------------------------------- //

    /* Передавать черз пропсы игру */
    return (
        <>
            {selectButtons(props.game.status)}
        </>
    );
}
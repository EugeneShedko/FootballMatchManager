import { useLocation, useNavigate } from "react-router-dom";
import { TO_GAME_HISTORY } from "../../../../../Utilts/Consts";

export default function CreatorButton(props) {

    const navigate = useNavigate();
    const location = useLocation();

    // --------- Функция выбора кнопок -------------- //

    function selectGameButtons(gameStatus) 
    {
        switch(gameStatus)
        {
            case 1: return <>
                           <EditGameButton /> 
                           <DeleteGameButton />
                           </>;
            case 2: return <><FinishGame /></>                              
            case 3: return <></>                              
            default: return <></>;               
        }
    }

    // ---------------- Кнопки ----------------------- //
    // ------------ Кнопка редактирования матча ----- //

    function EditGameButton() {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Редактировать"
                    onClick={props.editGame}
                />

            </>
        );
    }

    // -------------- Кнопка удаления матча -------------------- //

    function DeleteGameButton() {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Удалить"
                    onClick={props.deleteMatch} />

            </>
        );
    }

    // --------------- Кнопка завершения матча  ---------------------- //

    /* Пока что кнопка без обработчика */

    function FinishGame()
    {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Завершить матч"
                    onClick={() => navigate(location.pathname + TO_GAME_HISTORY)}
                     />

            </>
        );  
    }

    // --------------------------------------------------------- //

    return (
        <>
            {selectGameButtons(props.gameStatus)}
        </>
    );
}
export default function CreatorButton(props) {

    /* Эти кнопки должны быть доступны только в определенный статус */
    /* Кнопку Покинуть нужно убрать у организатора */

    /* Нужно передавать статус матча */

    // --------- Функция выбора кнопок -------------- //

    function selectGameButtons(gameStatus) 
    {
        switch(gameStatus)
        {
            case 1: return <>
                           <EditGameButton /> 
                           <DeleteGameButton />
                           </>;
            {/* Кнопка завершения матча */}
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
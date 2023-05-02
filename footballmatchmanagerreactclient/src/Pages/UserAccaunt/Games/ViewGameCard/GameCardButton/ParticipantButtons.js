export default function ParticipantButton(props) {

    // ------------------------------------------------------------------ //

    function LeavButton() {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Покинуть"
                    onClick={props.leaveMatch} />
            </>
        );
    }

    // ------------------------------------------------------------------ //

    function RequestButton() {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Запрос на участие"
                    onClick={props.sendRequestForPart} />

            </>
        );
    }

    // ------------------------------------------------------------------ //

    function AddButton() {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Присоединиться"
                    onClick={props.addToMatch}
                />
            </>);
    }

    // ------------------ Функция выбора кнопок --------------------------- //

    function selectGameButtons(gameStatus) {
        switch (gameStatus) {
            case 1: return <>
                            {props.isPart ? <LeavButton />
                            : 
                            props.game.currPlayers >= props.game.maxPlayers ?
                            <div className="match-full-text"> Достигнуто требуемое количество пользователей </div>
                            : 
                            props.game.type === 0 ? <RequestButton /> : <AddButton />
                            }
                           </>;
            case 2: return <></>
            case 3: return <></>
            default: return <></>;
        }
    }

    // -------------------------------------------------------------------- //

    return (
        <>
            {selectGameButtons(props.game.status)}
        </>
    );
}
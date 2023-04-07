export default function ParticipantButton(props) {

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

    /* Передат сюда в пропсах игру */
    return (
        <>
            {props.game.type === 0 ? <RequestButton /> : <AddButton />}
        </>
    );
}
export default function GameAdminButtons(props) {

    // -------------- Кнопка удаления матча -------------------- //

    function DeleteGameButton() {
        return (
            <>
                <input className="match-delete-button"
                    type="button"
                    value="Удалить"
                    onClick={props.deleteMatch} />

            </>
        );
    }

    // -------------------------------------------------------- //

    return (
        <>
        <DeleteGameButton />
        </>
    );
}
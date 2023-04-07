export default function CreatorButton(props) {
    return (
        <>
            <input className="match-join-button"
                type="button"
                value="Редактировать"
                onClick={props.editGame}
            />
            <input className="match-join-button"
                type="button"
                value="Удалить"
                onClick={props.deleteMatch} />
        </>
    );
}
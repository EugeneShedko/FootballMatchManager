
export default function TeamCreatorButtons(props) {

    // -----------------------  Удаление команды -------------------- //

    function DeleteTeam() {
        return (
            <>
                <input className="team-delete-buttonn"
                    type="button"
                    value="Удалить"
                    onClick={props.deleteTeam}
                />
            </>
        )
    }

    // --------------- Редактирование информации о команде -------------------- //

    function EditTeamInfo() {
        return (
            <>
                <input className="match-join-button"
                    type="button"
                    value="Редактировать"
                    onClick={props.editTeam}
                />
            </>
        );
    }

    // --------------------------------------------------- //

    return (<>
        <EditTeamInfo />
        <DeleteTeam />
    </>)
}
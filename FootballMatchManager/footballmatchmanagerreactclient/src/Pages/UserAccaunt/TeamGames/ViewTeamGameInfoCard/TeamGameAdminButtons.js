export default function TeamGameAdminButtons(props) {

    // -------------- Кнопка удаления матча -------------------- //

    function DeleteTeamGameButton() {
        return (
            <>
                <input className="team-delete-button"
                    type="button"
                    value="Удалить"
                    onClick={props.deleteTeamGame}
                />

            </>
        );
    }

    // -------------- Кнопка удаления участника -------------------- //

    function DeleteParticipantTeam() {
        return (
            <>
                <input className="team-delete-button"
                    type="button"
                    value="Удалить команду-участника"
                    onClick={props.leavFromTeamGame}
                />

            </>
        );
    }

    // -------------------------------------------------------- //

    function selectButtons() {
        switch (props.game.status) {
            case 0: return <DeleteTeamGameButton />
            case 1: return <>
            <DeleteParticipantTeam />
            <DeleteTeamGameButton />
            </>;
            case 2: return <DeleteTeamGameButton />;
            case 3: return <DeleteTeamGameButton />;
            default: return <></>;
        }
    }

    // -------------------------------------------------------- //

    return (
        <>
            {selectButtons()}
        </>
    );
}
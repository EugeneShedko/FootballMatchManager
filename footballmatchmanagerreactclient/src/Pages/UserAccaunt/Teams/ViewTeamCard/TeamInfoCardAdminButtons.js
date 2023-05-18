export default function TeamInfoCardAdminButtons(props) {

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

    // ---------------------------------------------------------- //

    return (<>
        <DeleteTeam />
    </>);
}
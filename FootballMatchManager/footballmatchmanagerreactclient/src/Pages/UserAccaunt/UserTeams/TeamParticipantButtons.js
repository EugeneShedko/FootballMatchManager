export default function TeamParticipantButtons(props) {

    //---------------- Кнопка запроса на участие в команде --- //

    function RequestToAddTeam() {
        return (<>
            <input className="team-join-button"
                type="button"
                value="Запрос на вступление" 
                onClick={props.requestToAddTeam}
                />
        </>);
    }

    // --------------- Кнопка ухода из команды ------------- //

    function LeavFromTeam() {
        return <>
            <input className="match-join-button"
                type="button"
                value="Покинуть"
                onClick={props.leaveTeam}
            />
        </>
    }

    // ---------------------------------------------- //

    return (<>
        {props.isPart ? <LeavFromTeam /> : <RequestToAddTeam /> }
    </>);
}
import ParticipantButton from "./ParticipantButtons";

export default function UserButton(props) {
    return (
        <>
            {props.isPart ?
                <input className="match-join-button"
                    type="button"
                    value="Покинуть"
                    onClick={props.leaveMatch} />
                :
                props.game.currPlayers >= props.game.maxPlayers ?
                <div className="match-full-text"> Достигнуто требуемое количество пользователей </div>
                : 
                <ParticipantButton game={props.game}
                                   sendRequestForPart = {props.sendRequestForPart}
                                   addToMatch = {props.addToMatch}
                                   />
                }
        </>
    );
}
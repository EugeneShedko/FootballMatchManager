import AdminPlayerBlock from "./adminPlayerBlock";

export default function AdminPlayerGenerator(props) {

    const searchPlayers = props.players.filter(searchingPlayers => {
        return String(searchingPlayers.userFirstName + ' ' + searchingPlayers.userLastName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    return (
        <div className="row ppplayers-absolute-container">
            {(searchPlayers.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {
                searchPlayers?.map((player) =>
                (
                    <div className="ppinfo-block">
                        <AdminPlayerBlock info={player}
                            setContState={props.setContState}
                            setPlayers={props.setPlayers}
                            isMatch={false} />
                    </div>
                ))
            }
        </div>

    );
}

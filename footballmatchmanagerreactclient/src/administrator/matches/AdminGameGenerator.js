import AdminMatchBlock from "./adminmatchblock";


export default function AdminGameGenerator(props) {

    const searchGamse = props.games.filter(searchingGames => {
        return String(searchingGames.gameName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    return (
        <div className="row mpmatches-absolute-container">
            {(searchGamse.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {
                searchGamse?.map((match) => (
                    <div className="mpinfo-block">
                        <AdminMatchBlock info={match}
                                         setContState={props.setContState}
                                         setMatches={props.setMatches} />
                    </div>
                ))
            }
        </div>
    );
}

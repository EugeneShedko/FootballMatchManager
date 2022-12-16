import PlayerBlock from "../../playerblock";
import MatchBlock from "../../matchblock";
import TornamentBlock from "../../tournamentblock";
import Matches from "../../userprofile/matches";
import Players from "../../userprofile/players";

export default function MainContent(props) {

    /*Проблема с выравниванием!*/
    return (
        <div className="row justify-content-center m-0">
            <div className="col-4 p-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска матча ..." />
                </div>
                <Matches isPanel={false}/>
            </div>
            {/*}
            <div className="col-3 p-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска турнира ..." />
                </div>
            </div>
             */}
            <div className="col-4 p-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска игрока ..." />
                </div>
                <Players isPanel={false} />
            </div>
        </div>
    );
}
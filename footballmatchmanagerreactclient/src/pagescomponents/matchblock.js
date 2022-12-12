/*Нужно чтобы страница матча и турнира отображалась корректно на главной страница
  и на странице в профиле пользователя, так как контейнеры имеют разные размеры*/
import "./../css/match.css";
import MatchInfoPage from "./matchinfopage";
import ReactDOM from 'react-dom/client';

export default function MatchBlock(props) {

    function setMatchInfoPage()
    {
        props.setContState(<MatchInfoPage info={props} />);
    }

    return (
        <div className="match-container" onClick={setMatchInfoPage}>
            <div className="match-back-block" />
            <div className="row match-block-content">
                <div className="col-5 match-block-column">
                    <div className="row m-0">
                        {props.info.matchName}
                    </div>
                </div>
                <div className="col-7 match-block-column">
                    <div className="row m-0">
                        {props.info.matchTime}
                    </div>
                    <div className="row m-0">
                        {props.info.matchFormat}
                    </div>
                    <div className="row m-0">
                        {props.info.matchAdress}
                    </div>
                    <div className="row m-0">
                        {props.info.playersCount}
                    </div>
                </div>
            </div>
        </div>
    );
}
import "./../../../css/Teams/NoExistTeamCard.css"

export default function NoExistTeamCard(props)
{
    return(
        <div className="no-main-container">
            <div className="no-main-info-container">
                <div className="not-text-container">
                    К сожалению вы не являетесь участником или организатором ни одной команды
                </div>
                <div className="image-cont">
                    <img className="sad-image"
                         src="http://localhost:5004/default/sad-face.png"
                         alt=""/>
                </div>
            </div>
        </div>
    );
}
import { useNavigate } from "react-router-dom";
import TeamInfoPage from "../ViewTeamCard/TeamInfoCard";

import "./../../../../css/Teams/TeamBlock.css";
import { TO_TEAM_CARD } from "../../../../Utilts/Consts";

export default function TeamBlock(props) {

    const navigate = useNavigate();

    // ------------------------------------------------------------------- //

    function setTeamInfoPage() {

        navigate(TO_TEAM_CARD + '/' + props.info.pkId);
    }

    // ------------------------------------------------------------------- //

    /* Изменить стиль команды */

    /* Можно добавить полье в бд КОЛИЧЕСТВО УЧАСТНИКОВ для команды */

    return (
        <div className="team-container" onClick={setTeamInfoPage}>
            <div className="team-back-block" />
            <div className="row team-block-content">
                <div className="col-5 team-block-column">
                    <div className="row m-0">
                        <img className="team-block-image"
                             src={"http://localhost:5004/" + props.info.image}  
                             alt="" />
                    </div>
                </div>
                <div className="col-7 team-block-column">
                    <div className="row m-0">
                        {props.info.name}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.crtDate)).toLocaleString().substring(0, (new Date(props.info.crtDate)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        Участников: {props.info.memberQnt}
                    </div>                    
                </div>
            </div>
        </div>
    );
}
import { toast } from "react-toastify";
import axios from "axios";

export default function ReadBlock(props) {

    return (
        <div className="column-button">
            <div className="butt-wrap">
                <input className="notifi-button read-button"
                    type="button"
                    value="Прочитать"
                    onClick={props.readNotifi}
                />
            </div>
        </div>
    );
}
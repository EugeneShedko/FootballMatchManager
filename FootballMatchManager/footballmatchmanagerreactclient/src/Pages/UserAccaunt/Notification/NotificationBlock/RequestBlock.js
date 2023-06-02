import { Context } from "../../../../index";
import { useContext, useEffect, useState } from "react";

export default function RequestNotifi(props) {

    const { user } = useContext(Context);

    return (
        <div className="column-button">
            <div className="butt-wrap">
                <input className="notifi-button accept-button"
                    type="button"
                    value="Принять"
                    onClick={props.acceptRequest}
                />
            </div>
            <div className="butt-wrap">

                <input className="notifi-button dismiss-button"
                    type="button"
                    value="Отклонить"
                    onClick={props.dismissRequest}
                />
            </div>
        </div>
    );
}
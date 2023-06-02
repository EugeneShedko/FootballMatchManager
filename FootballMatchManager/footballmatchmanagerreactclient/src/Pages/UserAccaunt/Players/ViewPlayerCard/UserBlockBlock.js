import { useContext } from "react";
import { Context } from "../../../../index";

import "./../../../../css/CommentBlock.css";

export default function UserBlockBlock(props) {

    return (
        <div className="row user-comment-container">
            <div className="col m-0 p-0">
                <div className="row m-0 p-0">
                    <div className="col-3 block-cont-head">
                        Начало блокировки
                    </div>
                    <div className="col-3 block-cont-head">
                        Окончание блокировки
                    </div>
                    <div className="col-6 block-cont-head">
                        Причина блокировки
                    </div>
                </div>
                <div className="row m-0 p-0">
                    <div className="col-3 block-cont-text">
                        {new Date(props.blockInfo.blockingDate).toLocaleString()
                            .substring(0, (new Date(props.blockInfo.blockingDate))
                                .toLocaleString().length - 3)};
                    </div>
                    <div className="col-3 block-cont-text">
                        {props.blockInfo.endBlockingDate ?
                            new Date(props.blockInfo.endBlockingDate).toLocaleString()
                                .substring(0, (new Date(props.blockInfo.endBlockingDate))
                                    .toLocaleString().length - 3)
                            : 'Навсегда'}
                    </div>
                    <div className="col-6 block-cont-text">
                        {props.blockInfo.reason}
                    </div>
                </div>
            </div>
        </div >
    );
}
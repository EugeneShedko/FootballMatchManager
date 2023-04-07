import "./../../../../../css/Message.css"

export default function MessageBlock(props) {

    return (
        <div className="message-container">
            <div className="message-back-block" />
            <div className="row message-block-content h-100">
                <div className="col-3">
                    <img id="message-profile-image" 
                         src={"http://localhost:5004/" + props.messageInfo.sender.image}  
                         alt="" />
                </div>
                <div className="col-9 message-block-column h-100">
                    <div className="row m-0 h-10">
                        {props.messageInfo.sender.firstName + ' ' + props.messageInfo.sender.lastName}
                    </div>
                    <div className="row m-0 message-text text-wrap">
                        {props.messageInfo.text}
                    </div>
                </div>
            </div>
        </div>
    );
}

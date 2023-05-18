import NotificationBlock from "./../NotificationBlock/NotificationBlock";


export default function NotificationGenerator(props) 
{

    return (
        <div className="row notifview-absolute-container">
            {props.notifiList?.map((notify) => (
                <div key={notify.pkId} className="notifview-info-block">
                    <NotificationBlock notify = {notify}
                                       setNotifiList = {props.setNotifiList}
                                        />
                </div>            
            ))}
        </div>
    );
}

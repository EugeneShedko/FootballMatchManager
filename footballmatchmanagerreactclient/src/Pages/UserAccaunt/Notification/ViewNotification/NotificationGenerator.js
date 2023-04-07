import NotificationBlock from "./../NotificationBlock/NotificationBlock";


export default function NotificationGenerator(props) 
{

    return (
        <div className="row notifview-absolute-container">
            {/*
            {(searchPlayers.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            */}
            {props.notifiList?.map((notify) => (
                <div className="notifview-info-block">
                    <NotificationBlock notify = {notify}
                                       setNotifiList = {props.setNotifiList} />
                </div>            
            ))}
        </div>
    );
}

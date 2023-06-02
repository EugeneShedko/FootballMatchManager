import { makeAutoObservable } from "mobx";

/* А может мне и не нужен класс? */
/* Может просто создать объект в контексте? */
/* Попробовать просто с объектом*/

class UserStore
{
    
    _notifihubconn;

    constructor()
    {
        this._isAuth  = false;
        this._isAdmin = false; 
        this._userId  = 0;
        this._userName = '';
        makeAutoObservable(this);
    }

    setUserName(name)
    {
        this._userName = name;
    }

    setUserId(id)
    {
        this._userId = id;
    }

    setAuth(bool)
    {
        this._isAuth = bool;
    }

    setAdmin(bool)
    {
        this._isAdmin = bool;
    }

    setNotifiHubConn(connection)
    {
        this._notifihubconn = connection;
    }

    get getUserName()
    {
        return this._userName;
    }

    get getUserId()
    {
        return this._userId;
    }

    get isAdmin()
    {
        return this._isAdmin;
    }

    get isAuth()
    {
        return this._isAuth;
    }

    get getNotifiHubConn()
    {
        return this._notifihubconn;
    }
}

export default UserStore;
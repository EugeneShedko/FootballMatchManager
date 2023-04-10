import { toast } from "react-toastify";
import { makeAutoObservable } from "mobx";


class UserStore
{
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
}

export default UserStore;
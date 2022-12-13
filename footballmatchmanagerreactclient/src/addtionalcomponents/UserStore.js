import { makeAutoObservable } from "mobx";


class UserStore
{
    constructor()
    {
        this._isAuth = false;
        makeAutoObservable(this);
    }

    setAuth(bool)
    {
        this._isAuth = bool;
    }

    get isAuth()
    {
        return this._isAuth;
    }
}

export default UserStore;
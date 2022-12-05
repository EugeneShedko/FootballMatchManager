import Content from "../pagescomponents/main/content";
import FRegistrationform from "../pagescomponents/main/registrationform";
import Loginform from "../pagescomponents/main/loginform";
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, USER_PROFILE_ROUTE } from "../Utilts/Consts";
import UserProfile from "../pagescomponents/userprofile/userprofile";

export const AppRoutes = [

    {
        path: MAIN_ROUTE,
        Component: <Content/>  
    },

    {
        path: LOGIN_ROUTE,
        Component: <Loginform/>  
    },

    {
        path: REGISTRATION_ROUTE,
        Component: <FRegistrationform />  
    },

    {
        path: USER_PROFILE_ROUTE,
        Component: <UserProfile />
    }

]
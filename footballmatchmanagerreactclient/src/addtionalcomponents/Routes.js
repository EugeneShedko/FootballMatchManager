import ContentContainer from "../pagescomponents/main/content/ContentContainer"
import FRegistrationform from "../pagescomponents/main/RegistrationForm";
import Loginform from "../pagescomponents/main/LoginForm";
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, USER_PROFILE_ROUTE, ADMIN_PROFILE_ROUTE  } from "../Utilts/Consts";
import UserProfile from "../pagescomponents/ProfilePage";
import Matches from "../pagescomponents/userprofile/Matches";
import AdminProfile from "../administrator/adminprofilepage";

export const AppRoutes = [

    {
        path: MAIN_ROUTE,
        Component: <ContentContainer />
    },

    {
        path: LOGIN_ROUTE,
        Component: <Loginform />
    },

    {
        path: REGISTRATION_ROUTE,
        Component: <FRegistrationform />
    },
]

export const AuthAppRoutes = [
    {
        path: USER_PROFILE_ROUTE,
        Component: <UserProfile />
    }
]

export const AdminAppRoutes = [
    {
        path: ADMIN_PROFILE_ROUTE,
        Component: <AdminProfile />        
    }
]
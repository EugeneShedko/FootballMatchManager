import { toast } from "react-toastify";

export function displayNotifMess(message)
{
    toast.success(message,
        {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            pauseOnFocusLoss: false
        });
}

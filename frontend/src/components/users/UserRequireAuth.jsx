import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuth";

export const UserRequireAuth = ({children}) => {
    const {user} = useContext(UserAuthContext);

    if(!user){
        return <Navigate to={`/account/login`} replace={true} />
    }
    return children;

}
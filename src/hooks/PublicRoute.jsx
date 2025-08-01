import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';

const PublicRoute = () => {
    const authToken = Cookies.get('authToken');
    const lastPage = Cookies.get("lastPath");

    if (lastPage && authToken) return <Navigate to={lastPage} />;
    return <Outlet />;
};

export default PublicRoute;
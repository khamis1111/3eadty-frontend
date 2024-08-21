import { Navigate, Outlet } from "react-router-dom";

const ChangeDirectRoute = ({ auth, children }) => {

    if (auth === false) {
        return <Navigate to="/" replace />
    }

    return children ? children : <Outlet />;
}

export default ChangeDirectRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();


    if (loading) {
        return <div>Cargando sesión...</div>; // O un spinner
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
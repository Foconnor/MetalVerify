import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const { user, isAdmin, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (!isAdmin) return <Navigate to="/" />;

    return children;
}

export default AdminRoute;

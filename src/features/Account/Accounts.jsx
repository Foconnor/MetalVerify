import "./Accounts.css";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";

function Accounts() {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="account-container">
            <h2>Account</h2>

            {!user ? (
                <div className="account-buttons">
                    <Link to="/login">
                        <button className="account-button">Log In</button>
                    </Link>

                    <Link to="/signup">
                        <button className="account-button">Sign Up</button>
                    </Link>
                </div>
            ) : (
                <div className="account-buttons-form">
                    <p>Welcome, {user.displayName || user.email}</p>

                    {isAdmin && (
                        location.pathname === "/admin-articles" ? (
                            <Link to="/">
                                <button className="account-button">
                                    Home
                                </button>
                            </Link>
                        ) : (
                            <Link to="/admin-articles">
                                <button className="account-button">
                                    🛠 Admin Access
                                </button>
                            </Link>
                        )
                    )}

                    <button className="account-button" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}

export default Accounts;

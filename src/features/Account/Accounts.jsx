import { useEffect, useState } from "react";
import "./Accounts.css"
import {Link} from "react-router-dom"
import { auth, provider } from "../../firebase/firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function Accounts() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
        <div className="account-buttons">
          <p>Welcome {user.displayName || user.email}</p>
          <button className="account-button" onClick={handleLogout}>Log Out</button>
        </div>
      )}

    </div>
  );
}

export default Accounts;
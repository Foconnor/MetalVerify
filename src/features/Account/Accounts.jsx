import { useEffect, useState } from "react";
import { auth, provider } from "../../firebase/firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function Accounts() {

  const [user, setUser] = useState(null);

  // listen for login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>

      {user ? (
        <div>
          <p>
            Logged in as <strong>{user.displayName}</strong>
          </p>

          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="profile"
              style={{ width: "40px", borderRadius: "50%" }}
            />
          )}

          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      ) : (
        <button onClick={loginWithGoogle}>
          Sign in with Google
        </button>
      )}

    </div>
  );
}

export default Accounts;
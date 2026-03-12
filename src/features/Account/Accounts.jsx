import { useEffect, useState } from "react";
import "./Accounts.css"
import {Link} from "react-router-dom"
import { auth, provider } from "../../firebase/firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function Accounts() {
  return (
    <div className="account-container">
      <h2>Account</h2>
      <div className="account-buttons">
        <Link to="/login">
          <button className="account-button">Log In</button>
        </Link>

        <Link to="/signup">
          <button className="account-button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Accounts;
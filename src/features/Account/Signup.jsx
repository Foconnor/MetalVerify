import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { googleProvider, facebookProvider, microsoftProvider, twitterProvider } from "../../firebase/firebaseConfig.js";
import { createUserIfNotExists} from "./DatabaseCode.js";

function Signup() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCred.user, {
        displayName: `${firstName} ${lastName}`,
      });

      navigate("/");

      alert("Account created successfully!");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Login Succesful ",user);
      createUserIfNotExists(user);
      console.log("User data saved to Firestore");
      navigate("/");

    } catch (error) {
      console.error("Google Login Error: ",error.code, error.message);
      alert(`Google login failed: ${error.message}`);
    }
  };

  const loginFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Facebook error:", error);
    }
  };

  const loginMicrosoft = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      console.log("Microsoft:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Microsoft error:", error);
    }
  };


  const loginTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      console.log("Twitter:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Twitter error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>

      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      <hr />

      <button style={{ marginTop: "10px" }} onClick={loginGoogle}>
        Sign in with Google
      </button>
      

      <button style={{ marginTop: "10px" }} onClick={loginFacebook}>Sign in with Facebook</button>
      <button style={{ marginTop: "10px" }} onClick={loginMicrosoft}>Sign in with Microsoft</button>
      <button style={{ marginTop: "10px" }} onClick={loginTwitter}>Sign in with Twitter</button>
      
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default Signup;
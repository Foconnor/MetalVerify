import { useState } from "react";
import {  auth,googleProvider, facebookProvider, microsoftProvider, twitterProvider } from "../../firebase/firebaseConfig.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginEmail = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirect to home
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Google login failed");
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

  console.log(auth);
  console.log(googleProvider);

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
        <h2>Log In</h2>

        <form onSubmit={loginEmail} style={styles.form}>
          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
          />

          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
          />

          <button type="submit">Login</button>
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


export default Login;

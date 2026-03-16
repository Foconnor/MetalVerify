import { useState } from "react";
import { auth, provider } from "../../firebase/firebaseConfig.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {useNavigate} from "react-router-dom"

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginEmail = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login Succesful ",user);
      navigate("/");

    } catch (error) {
      console.error("Google Login Error: ",error.code, error.message);
      alert(`Google login failed: ${error.message}`);
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

      <button onClick={loginGoogle}>
        Sign in with Google
      </button>

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
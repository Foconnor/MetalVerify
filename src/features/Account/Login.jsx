import { useState } from "react";
import { auth, provider } from "../../firebase/firebaseConfig.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Google login failed");
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

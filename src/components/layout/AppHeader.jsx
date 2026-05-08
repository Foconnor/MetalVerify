import metalVerifyLogo from "../../assets/MetalVerify-logo.png";
import { useNavigate } from "react-router-dom";

function AppHeader() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/")}
        style={styles.button}
      >
        <img
          src={metalVerifyLogo}
          alt="Metal Verify"
          style={styles.logo}
        />
      </button>
    </div>
  );
}

export default AppHeader;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },

  logo: {
    width: "450px",
    maxWidth: "95%",
    height: "auto",
    objectFit: "contain",
  },

  button: {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
  },
};
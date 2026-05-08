import metalVerifyLogo from "../../assets/metal-verify-logo.jpg";

function AppHeader() {
  return (
    <div style={styles.container}>
      <img
        src={metalVerifyLogo}
        alt="Metal Verify"
        style={styles.logo}
      />
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
    width: "300px",
    maxWidth: "90%",
    height: "auto",
    objectFit: "contain",
  },
};
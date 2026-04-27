function RightSidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>Sponsored</h2>

      <div style={styles.card}>
        <p>Trusted Silver Dealer</p>
        <button style={styles.button}>View Offers</button>
      </div>

      <div style={styles.card}>
        <p>Buy Verified Coins</p>
        <button style={styles.button}>Shop Now</button>
      </div>
    </div>
  );
}

export default RightSidebar;

const styles = {
  sidebar: {
    flex: 1,
    minWidth: "200px",
    maxWidth: "250px",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "10px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  button: {
    marginTop: "8px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1e1e1e",
    color: "white",
    cursor: "pointer",
  },
};
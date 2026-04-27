import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

function PageLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <LeftSidebar />

      <main style={styles.main}>
        {children}
      </main>

      <RightSidebar />
    </div>
  );
}

export default PageLayout;

const styles = {
  wrapper: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    padding: "20px",
    flexWrap: "wrap",
  },
  main: {
    flex: 2,
    minWidth: "300px",
  },
};
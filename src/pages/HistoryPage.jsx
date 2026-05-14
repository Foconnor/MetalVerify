import PageLayout from "../components/layout/PageLayout";
import AppHeader from "../components/layout/AppHeader";
import { useNavigate } from "react-router-dom";
import History from "../features/Account/History.jsx";

function HistoryPage() {
    const navigate = useNavigate();

    return (
        <PageLayout>
            <AppHeader />
            <div >
                <button style = {styles.button} onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
            <History />
        </PageLayout>
    );
}

export default HistoryPage;

const styles = {
  button: {
    flex: 1,
    padding: "15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#1e1e1e",
    color: "white",
  },
};

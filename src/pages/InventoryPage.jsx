import PageLayout from "../components/layout/PageLayout.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import { useNavigate } from "react-router-dom";
import Inventory from "./Inventory.jsx";

export default function InventoryPage() {
    const navigate = useNavigate();

    return (
        <PageLayout>
            <AppHeader />
            <div >
                <button style={styles.button} onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
            <Inventory />
        </PageLayout>
    );
}

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
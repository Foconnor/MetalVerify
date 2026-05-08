import StartScan from "./StartScan.jsx";
import PageLayout from "../components/layout/PageLayout.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";

function StartScanPage() {
  return (
    <PageLayout>
      <AppHeader />

      <StartScan />
    </PageLayout>
  );
}

export default StartScanPage;

const styles = {
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
};
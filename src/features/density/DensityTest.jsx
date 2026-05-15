import { useState } from "react";
import "./DensityTest.css";

import { useAuth } from "../../context/AuthContext";
import { useThreeTest } from "../../context/ThreeTestContext";
import { useTestStore } from "../../context/TestStoreContext";
import { useNavigate } from "react-router-dom";
import { saveDensityTest } from "../Account/DatabaseCode.js";
import { saveScan } from "../../firebase/saveScan.js";

// coin imports
import CoinDensityTest from "./Stages/CoinDensitytest.jsx";
import CoinDensityResult from "./Stages/CoinDensityResult.jsx";

// bar imports
import BarDensityTest from "./Stages/BarDensityTest.jsx";
import BarDensityResult from "./Stages/BarDensityResult.jsx";

function DensityTest() {
  const { user } = useAuth();
  const { registerTest } = useThreeTest();
  const { selectedItem } = useTestStore();

  const [label, setLabel] = useState("");
  const [stage, setStage] = useState("input");
  const [resultData, setResultData] = useState(null);

  const navigate = useNavigate();
  const selectedType = selectedItem?.type;
  const selectedProfile = selectedItem;
  const [inventoryId, setInventoryId] = useState(null);
  const { threeTestMode, testsRemaining } = useThreeTest();

  const handleResult = async (data) => {
    setResultData(data);
    setStage("result");

    const testSession = registerTest();

    const assignedThreeTestId = testSession?.threeTestId;
    const completed = testSession?.completed;

    console.log("Registered test:", testSession);
    console.log("Tests remaining:", testSession ? testSession.testsRemaining : "N/A");

    const testData = {
      itemType: selectedType,
      profileName: selectedProfile?.name,

      inputs: data.inputs,

      results: {
        density: data.density,
        expectedDensity: data.expectedDensity,
        confidence: data.confidence,
        verdict: data.verdict
      },

      label,
      threeTestId: assignedThreeTestId,
      inventoryId
    };

    if (user) {
      await saveDensityTest(testData);

      await saveScan({
        userId: user.uid,
        testType: "density",
        metalType: selectedType,
        profileName: selectedProfile?.name,
        result: data.verdict,
        confidence: data.confidence,
        label,
        threeTestId: assignedThreeTestId,
        inventoryId
      });
    }
    if (completed && assignedThreeTestId) {
      navigate(`/three-test-result/${assignedThreeTestId}`);
    }
  };

  const reset = () => {
    setStage("input");
    setResultData(null);
  };

  if (!selectedProfile) {
    return <p>No coin or bar selected.</p>;
  }


  return (

      <div>

        {threeTestMode && (
            <div style={{ marginBottom: 20, textAlign: "center" }}>
              <p><strong>3-Test Mode Active</strong> — {testsRemaining} remaining</p>
              <div style={{ height: 8, background: "#ddd", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${((3 - testsRemaining) / 3) * 100}%`,
                  background: "linear-gradient(to right, #4caf50, #2196f3)",
                  transition: "width 0.4s"
                }} />
              </div>
            </div>
        )}
        <p>
          Selected: <strong>{selectedProfile.name}</strong>
        </p>

        {selectedType === "coin" && stage === "input" && (
            <CoinDensityTest
                selectedProfile={selectedProfile}
                onCalculate={handleResult}
                onHome={reset}
            />
        )}

        {selectedType === "coin" && stage === "result" && resultData && (
            <CoinDensityResult
                data={resultData}
                onReset={reset}
            />
        )}

        {selectedType === "bar" && stage === "input" && (
            <BarDensityTest
                selectedProfile={selectedProfile}
                onCalculate={handleResult}
                onHome={reset}
            />
        )}

        {selectedType === "bar" && stage === "result" && resultData && (
            <BarDensityResult
                data={resultData}
                onReset={reset}
            />
        )}
      </div>
  );
}

export default DensityTest;
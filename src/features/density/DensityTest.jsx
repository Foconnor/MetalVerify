import { useState } from "react";
import "./DensityTest.css";

import { useAuth } from "../../context/AuthContext";
import { useThreeTest } from "../../context/ThreeTestContext";
import { useTestStore } from "../../context/TestStoreContext";

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

  const selectedType = selectedItem?.type;
  const selectedProfile = selectedItem;

  const handleResult = async (data) => {
    setResultData(data);
    setStage("result");

    const assignedThreeTestId = registerTest();

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
      threeTestId: assignedThreeTestId
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
        threeTestId: assignedThreeTestId
      });
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
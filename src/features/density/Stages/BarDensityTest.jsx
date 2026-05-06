import { useEffect, useState } from "react";
import { calculateBarDensity } from "../DensityCalculations";
import { fetchBarProfiles } from "../../Account/DatabaseCode.js";

function BarDensityTest({ onCalculate, onHome }) {
  const [inputData, setInputData] = useState({
    length: "",
    width: "",
    height: "",
    weight: ""
  });

  const [barProfiles, setBarProfiles] = useState({});
  const [selectedBar, setSelectedBar] = useState("unknown");

  useEffect(() => {
    const loadBarProfiles = async () => {
      const profiles = await fetchBarProfiles();
      setBarProfiles(profiles);
    };

    loadBarProfiles();
  }, []);

  const handleBarChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleBarSelect = (e) => {
    const value = e.target.value;
    setSelectedBar(value);
  };

  const handleSubmit = () => {
    const density = calculateBarDensity(
      inputData.length,
      inputData.width,
      inputData.height,
      inputData.weight
    );

    console.log("Calculated density:", density);

    const expectedDensity = 10.49;
    const deviation = Math.abs(density - expectedDensity);
    const confidence = Math.max(0, 100 - (deviation / expectedDensity) * 100).toFixed(2);

    const resultData = {
      confidence,
      density,
      expectedDensity
    };

    onCalculate({
      type: "density",
      itemType: "bar",
      input: inputData,
      results: resultData,
      selectedBarData: selectedBar === "unknown" ? null : barProfiles[selectedBar]
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
        margin: "0 auto"
      }}
    >
      <h2>Bar Density Test</h2>

      {/* Bar Selector */}
      <div className="form-row">
        <label className="form-label">Select Bar:</label>
        <select
          value={selectedBar}
          onChange={handleBarSelect}
          className="form-input"
        >
          <option value="unknown">Not Sure / Don't Know</option>
          {Object.entries(barProfiles).map(([id, bar]) => (
            <option key={id} value={id}>
              {bar.name}
            </option>
          ))}
        </select>
      </div>

      {/* Length */}
      <div className="form-row">
        <label className="form-label">Length:</label>
        <input
          type="number"
          name="length"
          value={inputData.length}
          onChange={handleBarChange}
          className="form-input"
        />
        <span>cm</span>
      </div>

      {/* Width */}
      <div className="form-row">
        <label className="form-label">Width:</label>
        <input
          type="number"
          name="width"
          value={inputData.width}
          onChange={handleBarChange}
          className="form-input"
        />
        <span>cm</span>
      </div>

      {/* Height */}
      <div className="form-row">
        <label className="form-label">Height:</label>
        <input
          type="number"
          name="height"
          value={inputData.height}
          onChange={handleBarChange}
          className="form-input"
        />
        <span>cm</span>
      </div>

      {/* Weight */}
      <div className="form-row">
        <label className="form-label">Weight:</label>
        <input
          type="number"
          name="weight"
          value={inputData.weight}
          onChange={handleBarChange}
          className="form-input"
        />
        <span>g</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={onHome}>Home</button>
        <button onClick={handleSubmit}>Calculate</button>
      </div>
    </div>
  );
}

export default BarDensityTest;
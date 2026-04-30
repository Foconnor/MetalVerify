import { useEffect, useState } from "react";

function BarDensityResult({ data, onReset }) {
  const [barPosition, setBarPosition] = useState(50);

  console.log("BarDensityResult received data:", data);

  const calculateBarPosition = (density) => {
    const EXPECTED =
      data.selectedBarData !== null ? data.selectedBarData.expectedDensity : 10.49;

    const MAX_RANGE = 2;
    const deviation = parseFloat(density) - EXPECTED;
    const position = 50 + (deviation / MAX_RANGE) * 50;

    return Math.min(100, Math.max(0, position));
  };

  useEffect(() => {
    if (data.results.density !== null) {
      const position = calculateBarPosition(data.results.density);
      setBarPosition(position);
    }
  }, [data.results.density]);

  return (
    <div>
      <h2>Bar Results</h2>

      {data.results.confidence !== null && (
        <div
          style={{
            marginTop: "1rem",
            width: "260px",
            margin: "0 auto",
            textAlign: "center"
          }}
        >
          {/* Gradient bar */}
          <div
            style={{
              position: "relative",
              height: "14px",
              borderRadius: "8px",
              background:
                "linear-gradient(to right, red, yellow, green, yellow, red)"
            }}
          >
            {/* Marker */}
            <div
              style={{
                position: "absolute",
                top: "-4px",
                left: `calc(${barPosition}% - 2px)`,
                width: "4px",
                height: "22px",
                backgroundColor: "#0c0a0a"
              }}
            />
          </div>

          {/* Labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              marginTop: "4px",
              color: "#ccc"
            }}
          >
            <span>LOW</span>
            <span>PERFECT</span>
            <span>HIGH</span>
          </div>

          <p style={{ marginTop: "0.5rem" }}>
            Confidence:{" "}
            <strong style={{ fontSize: "2.8rem" }}>
              {data.results.confidence}%
            </strong>
          </p>
        </div>
      )}

      <button onClick={onReset}>Test Again</button>
      
    </div>
  );
}

export default BarDensityResult;
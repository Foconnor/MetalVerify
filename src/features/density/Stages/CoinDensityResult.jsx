import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CoinDensityResult({ data, onReset }) {
  const [barPosition, setBarPosition] = useState(50);
    const navigate = useNavigate();
  const calculateBarPosition = (density) => {
    const EXPECTED = data.expectedDensity || 10.49;
    const MAX_RANGE = 2;

    const deviation = parseFloat(density) - EXPECTED;

    const position =
        50 + (deviation / MAX_RANGE) * 50;

    return Math.min(100, Math.max(0, position));
  };

  useEffect(() => {
    if (data.density !== null) {
      const position =
          calculateBarPosition(data.density);

      setBarPosition(position);
    }
  }, [data.density]);

  return (
      <div>
        <h2>Coin Results</h2>

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

          <p>
            Density:
            <strong> {data.density}</strong>
          </p>

          <p>
            Expected:
            <strong> {data.expectedDensity}</strong>
          </p>

          <p style={{ marginTop: "0.5rem" }}>
            Confidence:
            <strong
                style={{
                  fontSize: "2rem"
                }}
            >
              {" "}
              {data.confidence}%
            </strong>
          </p>

          <h3>{data.verdict}</h3>
        </div>
          <button
              onClick={() =>
                  navigate("/inventory/add", {
                      state: {
                          testData: {
                              type: "density",
                              profileName: selectedProfile?.name,
                              result: result,
                              confidence: metrics?.confidence,
                              threeTestId: activeThreeTestId,
                          },
                      },
                  })
              }
          >
              Add To Inventory
          </button>

        <button onClick={onReset}>
          Test Again
        </button>
      </div>
  );
}

export default CoinDensityResult;
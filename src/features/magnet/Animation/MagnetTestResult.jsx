import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./MagnetStyles.css";

const scenarios = {
  slow: {
    label: "Slow Slide",
    description: "This is typical of genuine silver. Magnetic drag slows movement.",
    magnetX: 220,
    duration: 2.8,
  },
  fast: {
    label: "Fast Drop",
    description: "The magnet moved too quickly. This may indicate a fake.",
    magnetX: 220,
    duration: 0.9,
  },
  stick: {
    label: "Sticks",
    description: "Strong attraction detected. Silver should not attract a magnet.",
    magnetX: 120,
    duration: 0.6,
  },
};

function MagnetTestResult({ result, setResult }) {
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (result) setAnimateKey((prev) => prev + 1);
  }, [result]);

  const current = result ? scenarios[result] : null;

  return (
    <div className="magnet-demo-card">
      <h3>Select What Happened</h3>

      <div className="magnet-tabs">
        <button className={result === "slow" ? "active" : ""} onClick={() => setResult("slow")}>
          Slow Slide
        </button>
        <button className={result === "fast" ? "active" : ""} onClick={() => setResult("fast")}>
          Fast Drop
        </button>
        <button className={result === "stick" ? "active" : ""} onClick={() => setResult("stick")}>
          Sticks
        </button>
      </div>

      {current && (
        <>
          <div className="magnet-stage">
            <div className="silver-bar angled"></div>

            <motion.div
              key={animateKey}
              className="magnet"
              initial={{ x: 0 }}
              animate={{ x: current.magnetX, y: current.magnetX * 0.18 }}
              transition={{ duration: current.duration, ease: "easeInOut" }}
            >
              🧲
            </motion.div>
          </div>

          <p className="magnet-label">{current.label}</p>
          <p className="magnet-description">{current.description}</p>
        </>
      )}
    </div>
  );
}

export default MagnetTestResult;
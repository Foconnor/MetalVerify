import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  "Place your silver on a flat surface",
  "Tilt it slightly",
  "Place the magnet at the top",
  "Release gently",
  "Observe how it slides",
];

function MagnetTestSetup() {
  const [step, setStep] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 2200),
      setTimeout(() => setStep(3), 3400),
      setTimeout(() => setStep(4), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [animateKey]);

  const replay = () => {
    setStep(0);
    setAnimateKey((prev) => prev + 1);
  };

  return (
    <div className="magnet-demo-card">
      <h3>How to Perform the Test</h3>

      <div className="magnet-stage setup-visual">
        <div className="silver-bar angled"></div>

        {step >= 2 && (
          <motion.div
            key={animateKey}
            className="magnet angled-magnet"
            initial={{ x: 10, y: 5 }}
            animate={step >= 3 ? { x: 210, y: 45 } : { x: 10, y: 5 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            🧲
          </motion.div>
        )}
      </div>

      <p className="magnet-description">{steps[step]}</p>

      <button className="replay-btn" onClick={replay}>
        Replay Setup
      </button>
    </div>
  );
}

export default MagnetTestSetup;
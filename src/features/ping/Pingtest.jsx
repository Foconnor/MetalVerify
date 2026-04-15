import { useState, useRef } from "react";
import { getMicStream, analyzePing } from "./pingUtils";
// import { COIN_PROFILES } from "./coinProfiles";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect } from "react";




export default function PingTest() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [coins, setCoins] = useState([]);
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const selectedCoin = coins.find(c => c.id === selectedCoinId);
  const [bars, setBars] = useState([]);
  const [selectedBarId, setSelectedBarId] = useState(null);
  const selectedBar = bars.find(b => b.id === selectedBarId);
  const [selectedType, setSelectedType] = useState("coin");

  const selectedProfile =
      selectedType === "coin" ? selectedCoin : selectedBar;



  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (selectedType === "coin" && coins.length > 0 && !selectedCoinId) {
      setSelectedCoinId(coins[0].id);
    }

    if (selectedType === "bar" && bars.length > 0 && !selectedBarId) {
      setSelectedBarId(bars[0].id);
    }
  }, [selectedType, coins, bars]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const querySnapshot = await getDocs(collection(db, "coinProfiles"));

        const coinList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCoins(coinList);

        if (coinList.length > 0) {
          setSelectedCoinId(coinList[0].id);
        }

      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    }

    fetchCoins();
  }, []);

  useEffect(() => {
    async function fetchBars() {
      try {
        const querySnapshot = await getDocs(collection(db, "barProfiles"));

        const barList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBars(barList);

        if (barList.length > 0) {
          setSelectedBarId(barList[0].id);
        }

      } catch (error) {
        console.error("Error fetching bars:", error);
      }
    }

    fetchBars();
  }, []);

  async function startTest() {
    reset();
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices) {
        throw new Error("MediaDevices API not supported in this browser.");
      }

      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        throw new Error("Microphone access requires HTTPS.");
      }

      setStatus("requesting microphone");

      streamRef.current = await getMicStream();

      if (!streamRef.current) {
        throw new Error("No microphone stream returned.");
      }

      setStatus("initializing audio");

      audioCtxRef.current = new AudioContext();

      const source =
          audioCtxRef.current.createMediaStreamSource(
              streamRef.current
          );

      analyserRef.current = audioCtxRef.current.createAnalyser();

      analyserRef.current.fftSize = 4096;
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      analyserRef.current.smoothingTimeConstant = 0.25;


      source.connect(analyserRef.current);

      setStatus("analyzing");

      const data = await analyzePing(
          analyserRef.current,
          audioCtxRef.current
      );

      finalize(data);

    } catch (err) {
      handleAudioError(err);
    }
  }


  function finalize({ freq, duration, harmonics }) {
    // const profile = COIN_PROFILES[selectedCoin];

    if (!selectedProfile) return;

    const ideal = selectedProfile.idealFreq;
    const maxDeviation = selectedProfile.tolerance;
    const maxDur = selectedProfile.minDuration;
    const isBar = selectedType === "bar";


    const deviation = Math.abs(freq - ideal);

    const freqScore =
        deviation <= maxDeviation
            ? 40 * (1 - deviation / maxDeviation)
            : 0;

    const durScore = isBar
        ? Math.min(duration / maxDur, 1) * 20
        : Math.min(duration / maxDur, 1) * 35;

    const stabilityScore =
        duration > 1 ? 25 :
            duration > 0.7 ? 18 :
                duration > 0.4 ? 10 :
                    5;

    const harmonicScore =
        harmonics >= 3 ? 25 :
            harmonics === 2 ? 18 :
                harmonics === 1 ? 10 :
                    0;


    const confidence = Math.round(
        (freqScore + durScore + stabilityScore + harmonicScore) / 1.25
    );


    let verdict;

    if (confidence >= 90)
      verdict = "Highly Likely Genuine";
    else if (confidence >= 70)
      verdict = "Likely Genuine";
    else if (confidence >= 50)
      verdict = "Uncertain";
    else if (confidence >= 30)
      verdict = "Likely Fake";
    else
      verdict = "Very Likely Fake";

    setMetrics({
      freq: freq.toFixed(0),
      duration: duration.toFixed(2),
      confidence
    });

    setResult(verdict);
    setStatus("done");
    cleanup();
  }

  function cleanup() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    analyserRef.current = null;
  }


  function reset() {
    cleanup();
    setMetrics(null);
    setResult(null);
    setStatus("idle");
  }

  // Styles
  const box = {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    textAlign: "center"
  };

  const progressOuter = {
    width: "100%",
    height: 10,
    background: "#eee",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden"
  };

  const progressInner = {
    height: "100%",
    transition: "width 0.5s ease"
  };

  function handleAudioError(err) {
    console.error("Ping Test Error:", err);

    let message = "Unknown error occurred.";

    if (err.name === "NotAllowedError") {
      message = "Microphone access was denied. Please allow microphone permissions.";
    }

    else if (err.name === "NotFoundError") {
      message = "No microphone device found.";
    }

    else if (err.name === "NotReadableError") {
      message = "Microphone is already in use by another application.";
    }

    else if (err.name === "OverconstrainedError") {
      message = "Requested microphone constraints cannot be satisfied.";
    }

    else if (err.name === "SecurityError") {
      message = "Microphone access blocked due to security restrictions.";
    }

    else if (err.message) {
      message = err.message;
    }

    setErrorMessage(message);
    setStatus("error");
    cleanup();
  }


  return (
      <div style={box}>
        <h2>Silver Ping Test</h2>
        <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="coin">Coin</option>
          <option value="bar">Bar</option>
        </select>

        {selectedType === "coin" ? (
            <select
                value={selectedCoinId || ""}
                onChange={(e) => setSelectedCoinId(e.target.value)}
            >
              {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name}
                  </option>
              ))}
            </select>
        ) : (
            <select
                value={selectedBarId || ""}
                onChange={(e) => setSelectedBarId(e.target.value)}
            >
              {bars.map((bar) => (
                  <option key={bar.id} value={bar.id}>
                    {bar.name}
                  </option>
              ))}
            </select>
        )}


        <button onClick={startTest}>
          Start Test
        </button>

        <p>Status: {status}</p>

        {errorMessage && (
            <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: "#ffe6e6",
                  border: "1px solid red",
                  borderRadius: 6,
                  color: "darkred"
                }}
            >
              <strong>Error:</strong> {errorMessage}
            </div>
        )}


        {metrics && (
            <div>
              <p>Peak: {metrics.freq} Hz</p>
              <p>Duration: {metrics.duration} s</p>

              <p>
                Confidence:{" "}
                <strong
                    style={{
                      color:
                          metrics.confidence >= 70
                              ? "green"
                              : metrics.confidence >= 50
                                  ? "orange"
                                  : "red"
                    }}
                >
                  {metrics.confidence}%
                </strong>
              </p>

              <div style={progressOuter}>
                <div
                    style={{
                      ...progressInner,
                      width: `${metrics.confidence}%`,
                      background:
                          metrics.confidence >= 70
                              ? "green"
                              : metrics.confidence >= 50
                                  ? "orange"
                                  : "red"
                    }}
                />
              </div>

              <p
                  style={{
                    marginTop: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                    color:
                        metrics.confidence >= 70
                            ? "green"
                            : metrics.confidence >= 50
                                ? "orange"
                                : "red"
                  }}
              >
                {result}
              </p>

            </div>
        )}
      </div>
  );
}

import { useState, useRef } from "react";
import { getMicStream } from "src/features/ping/pingUtils.js";
import { analyzePing } from "src/features/ping/pingUtils.js";

export default function PingTest() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  async function startTest() {
    reset();
//
    try {
      setStatus("listening");

      streamRef.current = await getMicStream();
      audioCtxRef.current = new AudioContext();

      const source =
          audioCtxRef.current.createMediaStreamSource(
              streamRef.current
          );

      analyserRef.current =
          audioCtxRef.current.createAnalyser();

      analyserRef.current.fftSize = 2048;

      source.connect(analyserRef.current);

      setStatus("analyzing");

      const data = await analyzePing(
          analyserRef.current,
          audioCtxRef.current
      );

      finalize(data);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function finalize({ freq, duration }) {
    const ideal = 5000;
    const maxDeviation = 1000;
    const maxDur = 1.2;

    const deviation = Math.abs(freq - ideal);

    const freqScore =
        Math.max(0, 1 - deviation / maxDeviation) * 40;

    const durScore =
        Math.min(duration / maxDur, 1) * 35;

    const stabilityScore =
        duration > 1 ? 25 :
            duration > 0.7 ? 18 :
                duration > 0.4 ? 10 :
                    5;

    const confidence = Math.round(
        freqScore + durScore + stabilityScore
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
    streamRef.current?.getTracks().forEach((t) =>
        t.stop()
    );
    audioCtxRef.current?.close();
  }

  function reset() {
    cleanup();
    setMetrics(null);
    setResult(null);
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

  return (
      <div style={box}>
        <h2>Silver Ping Test</h2>

        <button onClick={startTest}>
          Start Test
        </button>

        <p>Status: {status}</p>

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

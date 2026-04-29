import MagnetTestSetup from "../Animation/MagnetTestSetup";

function TestStage() {
  return (
    <div>
      <h2>Perform the Test</h2>

      {/* Placeholder for video
      <div style={{
        background: "#ddd",
        marginBottom: "20px"
      }}>
        <iframe
    width="100%"
    height="250"
    src="https://www.youtube.com/embed/gMVGF7Zm_Oo?start=76&end=9"
    title="Magnet Test Clip"
    frameBorder="0"
    allowFullScreen
  ></iframe>
      </div> */}

      <MagnetTestSetup />


      <ol style={{ textAlign: "left" }}>
        <li>Hold the silver at an angle</li>
        <li>Place magnet at the top</li>
        <li>Let it slide down</li>
      </ol>
    </div>
  );
}

export default TestStage;
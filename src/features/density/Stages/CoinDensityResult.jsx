function CoinDensityResult({ data, onReset }) {
  return (
    <div>
      <h2>Coin Results</h2>

      {console.log("Result Data:", data)}

      <button onClick={onReset}>Test Again</button>
    </div>
  );
}

export default CoinDensityResult;
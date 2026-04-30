export function calculateCoinDensity(diameter, thickness, weight) {
  const d = parseFloat(diameter);
  const t = parseFloat(thickness);
  const w = parseFloat(weight);

  if (isNaN(d) || isNaN(t) || isNaN(w)) throw new Error("Invalid input for coin");

  const radiusCm = (d / 2) / 10;
  const heightCm = t / 10;

  const volume = Math.PI * (radiusCm ** 2) * heightCm; // Cylinder volume: πr²h
  const density = w / volume;
  return density.toFixed(2);
}

export function calculateBarDensity(length, height, width, weight) {
  const l = parseFloat(length);
  const h = parseFloat(height);
  const w = parseFloat(width);
  const weightNum = parseFloat(weight);

  if (isNaN(l) || isNaN(h) || isNaN(w) || isNaN(weightNum)) throw new Error("Invalid input for bar");

  const volume = (l * h * w)/ 1000; // Rectangular prism volume
  const density = weightNum / volume;
  return density.toFixed(2);
}
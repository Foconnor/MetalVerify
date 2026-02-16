export function calculateCoinDensity(diameter, thickness, weight) {
  const d = parseFloat(diameter);
  const t = parseFloat(thickness);
  const w = parseFloat(weight);

  if (isNaN(d) || isNaN(t) || isNaN(w)) throw new Error("Invalid input for coin");

  const volume = Math.PI * (d / 2) ** 2 * t; // Cylinder volume: πr²h
  const density = w / volume;
  return density.toFixed(2);
}

export function calculateBarDensity(length, height, width, weight) {
  const l = parseFloat(length);
  const h = parseFloat(height);
  const w = parseFloat(width);
  const weightNum = parseFloat(weight);

  if (isNaN(l) || isNaN(h) || isNaN(w) || isNaN(weightNum)) throw new Error("Invalid input for bar");

  const volume = l * h * w; // Rectangular prism volume
  const density = weightNum / volume;
  return density.toFixed(2);
}
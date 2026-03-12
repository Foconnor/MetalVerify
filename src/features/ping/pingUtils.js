// ------------------------------
// Measure ambient noise first
// ------------------------------
export async function measureNoiseFloor(analyser) {

    const samples = 20;
    const timeData = new Uint8Array(analyser.fftSize);

    let total = 0;

    for (let i = 0; i < samples; i++) {

        analyser.getByteTimeDomainData(timeData);

        let sum = 0;

        for (let j = 0; j < timeData.length; j++) {
            const v = (timeData[j] - 128) / 128;
            sum += v * v;
        }

        const rms = Math.sqrt(sum / timeData.length);

        total += rms;

        await new Promise(r => setTimeout(r, 20));
    }

    return total / samples;
}


// ------------------------------
// Main ping analysis
// ------------------------------
export async function analyzePing(analyser, audioCtx) {

    const noiseFloor = await measureNoiseFloor(analyser);
    const threshold = noiseFloor * 2.5;

    const freqData = new Float32Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    const windowMs = 2000;
    const intervalMs = 20;

    let activeTime = 0;

    let bestFreq = 0;
    let bestMagnitude = -Infinity;
    let bestHarmonics = 0;

    const start = performance.now();

    return new Promise((resolve) => {

        const timer = setInterval(() => {

            // --------------------------
            // TIME DOMAIN (ring duration)
            // --------------------------
            analyser.getByteTimeDomainData(timeData);

            let sum = 0;

            for (let i = 0; i < timeData.length; i++) {

                const v = (timeData[i] - 128) / 128;

                sum += v * v;
            }

            const rms = Math.sqrt(sum / timeData.length);

            if (rms > threshold) {
                activeTime += intervalMs;
            }


            // --------------------------
            // FREQUENCY DOMAIN
            // --------------------------
            analyser.getFloatFrequencyData(freqData);

            let peaks = [];

            for (let i = 0; i < freqData.length; i++) {

                const magnitude = freqData[i];

                // Ignore weak signals
                if (magnitude < -65) continue;

                const freq =
                    i *
                    (audioCtx.sampleRate / analyser.fftSize);

                peaks.push({
                    freq: freq,
                    mag: magnitude
                });
            }

            // Sort strongest peaks first
            peaks.sort((a, b) => b.mag - a.mag);

            if (peaks.length > 0) {

                const fundamental = peaks[0].freq;

                if (peaks[0].mag > bestMagnitude) {

                    bestMagnitude = peaks[0].mag;

                    bestFreq = fundamental;
                }

                // --------------------------
                // Harmonic detection
                // --------------------------
                let harmonicMatches = 0;

                for (let p of peaks) {

                    const ratio = p.freq / fundamental;

                    if (Math.abs(ratio - 2) < 0.15)
                        harmonicMatches++;

                    if (Math.abs(ratio - 3) < 0.15)
                        harmonicMatches++;

                    if (Math.abs(ratio - 4) < 0.15)
                        harmonicMatches++;
                }

                bestHarmonics =
                    Math.max(bestHarmonics, harmonicMatches);
            }


            // --------------------------
            // Stop after time window
            // --------------------------
            if (performance.now() - start >= windowMs) {

                clearInterval(timer);

                resolve({
                    freq: bestFreq,
                    duration: activeTime / 1000,
                    harmonics: bestHarmonics
                });
            }

        }, intervalMs);

    });
}


// ------------------------------
// Microphone access
// ------------------------------
export async function getMicStream() {

    return navigator.mediaDevices.getUserMedia({
        audio: true
    });

}

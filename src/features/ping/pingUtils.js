export async function analyzePing(analyser, audioCtx) {
    const freqData = new Float32Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    const threshold = 0.015;
    const windowMs = 2000;
    const intervalMs = 20;

    let activeTime = 0;

    // Frequency snapshot
    analyser.getFloatFrequencyData(freqData);

    let max = -Infinity;
    let index = 0;
//
    for (let i = 0; i < freqData.length; i++) {
        if (freqData[i] > max) {
            max = freqData[i];
            index = i;
        }
    }

    const freq =
        index * (audioCtx.sampleRate / analyser.fftSize);

    const start = performance.now();

    return new Promise((resolve) => {
        const timer = setInterval(() => {
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

            if (performance.now() - start >= windowMs) {
                clearInterval(timer);

                resolve({
                    freq,
                    duration: activeTime / 1000
                });
            }
        }, intervalMs);
    });
}

export async function getMicStream() {
    return navigator.mediaDevices.getUserMedia({
        audio: true
    });
}

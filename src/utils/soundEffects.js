let sharedAudioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new Ctx();
  }
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Synthesizes a subtle, organic paper-slide sound via Web Audio API
 * (bandpass-filtered air brush + soft desk settle tap) when switching documents.
 */
export function playPageSwitchSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.28;
    const sampleCount = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const channel = noiseBuffer.getChannelData(0);

    // Smooth pink-ish noise for natural paper fiber texture
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < sampleCount; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      channel[i] = (b0 + b1 + b2 + white * 0.12) * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(1.15, now);
    filter.frequency.setValueAtTime(680, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.11);
    filter.frequency.exponentialRampToValueAtTime(920, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.11, now + 0.045);
    noiseGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);

    // Subtle soft paper-settle thump
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(145, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(68, now + 0.17);
    oscGain.gain.setValueAtTime(0.0001, now + 0.08);
    oscGain.gain.linearRampToValueAtTime(0.035, now + 0.095);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now + 0.08);
    osc.stop(now + 0.2);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}


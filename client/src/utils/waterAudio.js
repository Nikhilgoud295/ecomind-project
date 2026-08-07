/**
 * Native Web Audio API Procedural Water Sound Generator for EcoMind
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a resonant liquid water drop / chime sound
 */
export function playWaterDropSound(freq = 440) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch (e) {
    console.warn('Water audio playback error:', e);
  }
}

/**
 * Play a cascading multi-note water splash sequence
 */
export function playWaterSplashSequence() {
  const notes = [329.63, 392.00, 440.00, 523.25, 659.25];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playWaterDropSound(freq);
    }, idx * 70);
  });
}

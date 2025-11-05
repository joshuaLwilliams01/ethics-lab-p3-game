// Sound effects utility for button clicks and interactions

let clickAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!clickAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    clickAudioContext = new AudioContextClass();
  }
  
  // Resume context if suspended (required by some browsers)
  if (clickAudioContext.state === 'suspended') {
    clickAudioContext.resume();
  }
  
  return clickAudioContext;
}

/**
 * Play a satisfying button click sound effect
 */
export function playButtonClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  
  // Create a pleasant click sound with two tones
  // High frequency click (800Hz) - brief
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  
  clickOsc.type = 'sine';
  clickOsc.frequency.value = 800;
  
  clickGain.gain.setValueAtTime(0, now);
  clickGain.gain.linearRampToValueAtTime(0.15, now + 0.001); // Quick attack
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); // Quick decay
  
  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  
  clickOsc.start(now);
  clickOsc.stop(now + 0.05);
  
  // Low frequency thud (200Hz) - very brief for depth
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();
  
  thudOsc.type = 'sine';
  thudOsc.frequency.value = 200;
  
  thudGain.gain.setValueAtTime(0, now);
  thudGain.gain.linearRampToValueAtTime(0.08, now + 0.001);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  
  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);
  
  thudOsc.start(now);
  thudOsc.stop(now + 0.03);
}

/**
 * Play a success/confirmation sound
 */
export function playSuccess() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  
  // Rising tone pattern (success sound)
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, now + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.15);
  });
}


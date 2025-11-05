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
 * Check if sound is enabled by reading from localStorage
 */
function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('soundEnabled');
  return saved === 'true';
}

/**
 * Play an enticing, satisfying button click sound effect
 * Enhanced with musical chime and layered tones
 * Only plays if sound is enabled
 */
export function playButtonClick() {
  // Check if sound is enabled
  if (!isSoundEnabled()) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  
  // Primary click tone - pleasant chime (1000Hz)
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  
  clickOsc.type = 'sine';
  clickOsc.frequency.value = 1000;
  
  clickGain.gain.setValueAtTime(0, now);
  clickGain.gain.linearRampToValueAtTime(0.2, now + 0.002); // Quick attack
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // Smooth decay
  
  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  
  clickOsc.start(now);
  clickOsc.stop(now + 0.08);
  
  // Harmonic layer - octave up (2000Hz) for brightness
  const harmonicOsc = ctx.createOscillator();
  const harmonicGain = ctx.createGain();
  
  harmonicOsc.type = 'sine';
  harmonicOsc.frequency.value = 2000;
  
  harmonicGain.gain.setValueAtTime(0, now);
  harmonicGain.gain.linearRampToValueAtTime(0.1, now + 0.001);
  harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  
  harmonicOsc.connect(harmonicGain);
  harmonicGain.connect(ctx.destination);
  
  harmonicOsc.start(now);
  harmonicOsc.stop(now + 0.06);
  
  // Low frequency body (250Hz) - adds warmth and depth
  const bodyOsc = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  
  bodyOsc.type = 'sine';
  bodyOsc.frequency.value = 250;
  
  bodyGain.gain.setValueAtTime(0, now);
  bodyGain.gain.linearRampToValueAtTime(0.12, now + 0.003);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
  bodyOsc.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  
  bodyOsc.start(now);
  bodyOsc.stop(now + 0.1);
  
  // Subtle pitch bend for musical interest
  const bendOsc = ctx.createOscillator();
  const bendGain = ctx.createGain();
  
  bendOsc.type = 'sine';
  bendOsc.frequency.setValueAtTime(1200, now);
  bendOsc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);
  
  bendGain.gain.setValueAtTime(0, now);
  bendGain.gain.linearRampToValueAtTime(0.08, now + 0.002);
  bendGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  
  bendOsc.connect(bendGain);
  bendGain.connect(ctx.destination);
  
  bendOsc.start(now);
  bendOsc.stop(now + 0.05);
}

/**
 * Play a success/confirmation sound
 * Only plays if sound is enabled
 */
export function playSuccess() {
  // Check if sound is enabled
  if (!isSoundEnabled()) return;
  
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


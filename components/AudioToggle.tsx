'use client';
import { useEffect, useRef, useState } from "react";
import { playButtonClick } from "@/lib/sounds";
import { useSound } from "@/contexts/SoundContext";

export default function AudioToggle(){
  const audioContextRef = useRef<AudioContext|null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const scheduleIntervalRef = useRef<number|null>(null);
  const startTimeRef = useRef<number>(0);
  const { enabled, setEnabled } = useSound();

  // Generate James Bond/Mission Impossible style theme
  // Mid-tempo (110 BPM), suspenseful, confident pulse
  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Stop any existing audio first
      stopAudio();
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      startTimeRef.current = ctx.currentTime;
      
      // Mid-tempo: 113 BPM = ~0.531s per beat (confident, walking pace - increased by 3 BPM)
      const beatDuration = 0.531;
      const bassGain = 0.20; // Increased for richer bass
      const melodyGain = 0.14; // Increased for clearer melody
      const harmonyGain = 0.10; // Increased for better depth
      
      // James Bond/Mission Impossible inspired notes
      // Bass: Strong pulsing E2, B2, E3 pattern
      const bassNotes = [82.41, 123.47, 164.81]; // E2, B2, E3
      // Melody: Suspenseful but confident (E4, G#4, B4, E5)
      const melodyNotes = [329.63, 415.30, 493.88, 659.25]; // E4, G#4, B4, E5
      // Harmony: Suspense layer (minor third above)
      const harmonyNotes = [392.00, 466.16, 554.37, 783.99]; // G4, A#4, C#5, G5
      
      const isEnabledRef = { current: true };
      
      const scheduleNext = () => {
        if (!isEnabledRef.current || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;
        const measureDuration = beatDuration * 4; // 4/4 time
        const patternTime = (currentTime - startTimeRef.current) % (measureDuration * 2); // 2-measure pattern
        const beatInMeasure = (patternTime % measureDuration) / beatDuration;
        const measureNumber = Math.floor(patternTime / measureDuration) % 2;
        
        // Bass line - Strong confident pulse on beats 1, 2.5, 4
        // Enhanced with richer harmonics for better quality
        if (Math.abs(beatInMeasure - 0) < 0.1) {
          // Beat 1 - E2 (strong) - with harmonic enhancement
          const note = bassNotes[0];
          if (!isFinite(note) || note <= 0) return;
          
          // Main bass oscillator
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = note;
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(bassGain, currentTime + 0.015); // Faster attack
          gain.gain.setValueAtTime(bassGain, currentTime + beatDuration * 0.3); // Sustain
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.1); // Smoother decay
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 1.0);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
          
          // Subtle harmonic layer (octave above) for richness
          const harmonic = ctx.createOscillator();
          const harmonicGain = ctx.createGain();
          harmonic.type = 'sine';
          harmonic.frequency.value = note * 2;
          harmonicGain.gain.setValueAtTime(0, currentTime);
          harmonicGain.gain.linearRampToValueAtTime(bassGain * 0.15, currentTime + 0.02);
          harmonicGain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.8);
          harmonic.connect(harmonicGain);
          harmonicGain.connect(ctx.destination);
          harmonic.start(currentTime);
          harmonic.stop(currentTime + beatDuration * 0.8);
          oscillatorsRef.current.push(harmonic);
          gainNodesRef.current.push(harmonicGain);
          
        } else if (Math.abs(beatInMeasure - 1.5) < 0.1) {
          // Beat 2.5 - B2 (accent)
          const note = bassNotes[1];
          if (!isFinite(note) || note <= 0) return;
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = note;
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(bassGain * 0.9, currentTime + 0.015);
          gain.gain.setValueAtTime(bassGain * 0.9, currentTime + beatDuration * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.75);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 0.7);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
        } else if (Math.abs(beatInMeasure - 3) < 0.1) {
          // Beat 4 - E3 (resolution)
          const note = bassNotes[2];
          if (!isFinite(note) || note <= 0) return;
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = note;
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(bassGain, currentTime + 0.015);
          gain.gain.setValueAtTime(bassGain, currentTime + beatDuration * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.95);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 0.9);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
        }
        
        // Melody - Suspenseful but confident (plays on beats 2, 3.5)
        if (Math.abs(beatInMeasure - 1) < 0.15 || Math.abs(beatInMeasure - 2.5) < 0.15) {
          // Calculate note index based on which beat we're on
          let noteIndex = 0;
          if (Math.abs(beatInMeasure - 1) < 0.15) {
            // Beat 2 - use first melody note
            noteIndex = 0;
          } else if (Math.abs(beatInMeasure - 2.5) < 0.15) {
            // Beat 3.5 - use second melody note, vary by measure
            noteIndex = (1 + measureNumber) % melodyNotes.length;
          }
          
          const note = melodyNotes[noteIndex];
          
          // Validate note is finite before using
          if (!isFinite(note) || note <= 0) {
            console.warn('Invalid melody note:', note);
            return;
          }
          
          // Main melody oscillator
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = note;
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(melodyGain, currentTime + 0.04); // Slightly faster attack
          gain.gain.setValueAtTime(melodyGain, currentTime + beatDuration * 0.4); // Sustain phase
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.4); // Smoother decay
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 1.3);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
          
          // Subtle vibrato for warmth (very gentle)
          const vibrato = ctx.createOscillator();
          const vibratoGain = ctx.createGain();
          const vibratoDepth = ctx.createGain();
          vibrato.type = 'sine';
          vibrato.frequency.value = 5; // 5 Hz vibrato
          vibratoGain.gain.value = 2; // Very subtle pitch variation
          vibratoDepth.gain.value = 0.02; // Small depth
          vibrato.connect(vibratoGain);
          vibratoGain.connect(vibratoDepth);
          vibratoDepth.connect(osc.frequency);
          vibrato.start(currentTime);
          vibrato.stop(currentTime + beatDuration * 1.3);
          oscillatorsRef.current.push(vibrato);
          gainNodesRef.current.push(vibratoGain);
        }
        
        // Harmony - Subtle suspense layer (plays on beat 2.5)
        if (Math.abs(beatInMeasure - 2.5) < 0.2) {
          const noteIndex = measureNumber % harmonyNotes.length;
          const note = harmonyNotes[noteIndex];
          
          // Validate note is finite before using
          if (!isFinite(note) || note <= 0) {
            console.warn('Invalid harmony note:', note);
            return;
          }
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = note;
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(harmonyGain, currentTime + 0.06); // Faster attack
          gain.gain.setValueAtTime(harmonyGain, currentTime + beatDuration * 0.35); // Sustain
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.1); // Smoother decay
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 1.0);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
        }
        
        // Schedule next iteration
        if (isEnabledRef.current && audioContextRef.current) {
          scheduleIntervalRef.current = window.setTimeout(
            scheduleNext,
            beatDuration * 1000 / 8 // Check 8 times per beat for precision
          );
        }
      };
      
      (audioContextRef.current as any)._isEnabledRef = isEnabledRef;
      scheduleNext();
      
      return isEnabledRef;
    } catch (e) {
      console.warn('Audio context not available:', e);
    }
  };

  const stopAudio = () => {
    if (scheduleIntervalRef.current !== null) {
      clearTimeout(scheduleIntervalRef.current);
      scheduleIntervalRef.current = null;
    }
    
    if (audioContextRef.current && (audioContextRef.current as any)._isEnabledRef) {
      (audioContextRef.current as any)._isEnabledRef.current = false;
    }
    
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    oscillatorsRef.current = [];
    
    gainNodesRef.current.forEach(gain => {
      try { gain.disconnect(); } catch (e) {}
    });
    gainNodesRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    
    startTimeRef.current = 0;
  };

  // Handle audio playback
  useEffect(() => {
    if (enabled) {
      startAudio();
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [enabled]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Speaker icon with enhanced animation */}
        <div 
          className={`text-2xl transition-all duration-300 ${
            enabled 
              ? 'animate-pulse-glow text-[#8C1515] scale-110' 
              : 'text-[#53565A] scale-100'
          }`}
          style={{
            filter: enabled ? 'drop-shadow(0 0 8px rgba(140,21,21,0.6))' : 'none',
            transform: enabled ? 'scale(1.15)' : 'scale(1)',
            animation: enabled ? 'pulse-glow 2s ease-in-out infinite' : 'none'
          }}
        >
          {enabled ? '🔊' : '🔇'}
        </div>
        {/* Pulsing ring effect when enabled */}
        {enabled && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-2 border-[#8C1515] opacity-30"
              style={{
                animation: 'pulse-ring 2s ease-in-out infinite',
                transform: 'scale(1.5)',
                margin: '-8px'
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 border-[#8C1515] opacity-20"
              style={{
                animation: 'pulse-ring 2s ease-in-out infinite 0.3s',
                transform: 'scale(1.8)',
                margin: '-12px'
              }}
            />
          </>
        )}
      </div>
      <div className={`text-xs font-medium transition-colors duration-300 ${
        enabled ? 'text-[#8C1515]' : 'text-[#53565A]'
      }`}>
        {enabled ? 'Sound On' : 'Sound Off'}
      </div>
      <button 
        onClick={() => {
          playButtonClick();
          setEnabled(!enabled);
        }} 
        className={`text-xs transition-all duration-300 hover:scale-105 ${
          enabled 
            ? 'text-[#8C1515] hover:text-[#820f0f] font-semibold' 
            : 'text-[#53565A] hover:text-[#8C1515]'
        } cursor-pointer underline`}
        aria-pressed={enabled}
        aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      >
        (Click to {enabled ? "disable" : "enable"})
      </button>
    </div>
  );
}

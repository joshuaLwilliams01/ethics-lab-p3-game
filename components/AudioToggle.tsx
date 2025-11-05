'use client';
import { useEffect, useRef, useState } from "react";
import { playButtonClick } from "@/lib/sounds";
import { useSound } from "@/contexts/SoundContext";

export default function AudioToggle(){
  const audioContextRef = useRef<AudioContext|null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const scheduleIntervalRef = useRef<number|null>(null);
  const startTimeRef = useRef<number>(0);
  const masterGainRef = useRef<GainNode|null>(null);
  const reverbConvolverRef = useRef<ConvolverNode|null>(null);
  const lowPassFilterRef = useRef<BiquadFilterNode|null>(null);
  const { enabled, setEnabled } = useSound();

  // Professional audio generation with filters, reverb, and advanced synthesis
  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Stop any existing audio first
      stopAudio();
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      startTimeRef.current = ctx.currentTime;
      
      // Create master gain for overall volume control
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.35; // Professional volume level
      masterGainRef.current = masterGain;
      
      // Create low-pass filter for warmth and smoothness
      const lowPass = ctx.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.value = 3500; // Warm, smooth cutoff
      lowPass.Q.value = 0.7; // Gentle resonance
      lowPassFilterRef.current = lowPass;
      
      // Create reverb for spatial depth and professionalism
      const reverb = ctx.createConvolver();
      // Generate impulse response for reverb (short room reverb)
      const reverbLength = ctx.sampleRate * 0.3; // 300ms reverb
      const reverbBuffer = ctx.createBuffer(2, reverbLength, ctx.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const channelData = reverbBuffer.getChannelData(channel);
        for (let i = 0; i < reverbLength; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2);
        }
      }
      reverb.buffer = reverbBuffer;
      reverbConvolverRef.current = reverb;
      
      // Connect: source -> filter -> reverb -> master gain -> destination
      lowPass.connect(reverb);
      reverb.connect(masterGain);
      masterGain.connect(ctx.destination);
      
      // Mid-tempo: 113 BPM = ~0.531s per beat
      const beatDuration = 0.531;
      const bassGain = 0.22;
      const melodyGain = 0.18;
      const harmonyGain = 0.12;
      const subBassGain = 0.15;
      
      // Professional note selection - E minor pentatonic for smooth, professional sound
      const bassNotes = [82.41, 123.47, 164.81]; // E2, B2, E3
      const melodyNotes = [329.63, 392.00, 493.88, 587.33]; // E4, G4, B4, D5 (smoother progression)
      const harmonyNotes = [392.00, 466.16, 523.25, 659.25]; // G4, A#4, C5, E5
      const subBassNotes = [41.20, 61.74, 82.41]; // E1, B1, E2
      
      const isEnabledRef = { current: true };
      
      const scheduleNext = () => {
        if (!isEnabledRef.current || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;
        const measureDuration = beatDuration * 4;
        const patternTime = (currentTime - startTimeRef.current) % (measureDuration * 2);
        const beatInMeasure = (patternTime % measureDuration) / beatDuration;
        const measureNumber = Math.floor(patternTime / measureDuration) % 2;
        
        // Bass line - Professional with detuned oscillators for warmth
        if (Math.abs(beatInMeasure - 0) < 0.1) {
          const note = bassNotes[0];
          if (!isFinite(note) || note <= 0) return;
          
          // Main bass with slight detuning for richness
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator(); // Detuned copy for warmth
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc1.type = 'triangle';
          osc1.frequency.value = note;
          osc2.type = 'triangle';
          osc2.frequency.value = note * 1.003; // Slight detune for warmth
          
          filter.type = 'lowpass';
          filter.frequency.value = 800; // Bass filter
          filter.Q.value = 1.0;
          
          // Professional envelope with smooth curves
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(bassGain * 0.5, currentTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(bassGain, currentTime + 0.02);
          gain.gain.setValueAtTime(bassGain, currentTime + beatDuration * 0.4);
          gain.gain.exponentialRampToValueAtTime(bassGain * 0.3, currentTime + beatDuration * 0.75);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.0);
          
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(filter);
          filter.connect(lowPass);
          
          osc1.start(currentTime);
          osc1.stop(currentTime + beatDuration * 1.0);
          osc2.start(currentTime);
          osc2.stop(currentTime + beatDuration * 1.0);
          
          oscillatorsRef.current.push(osc1, osc2);
          gainNodesRef.current.push(gain);
          filtersRef.current.push(filter);
          
          // Sub-bass foundation
          const subBass = ctx.createOscillator();
          const subGain = ctx.createGain();
          const subFilter = ctx.createBiquadFilter();
          
          subBass.type = 'sine';
          subBass.frequency.value = subBassNotes[0];
          subFilter.type = 'lowpass';
          subFilter.frequency.value = 120;
          subFilter.Q.value = 0.5;
          
          subGain.gain.setValueAtTime(0, currentTime);
          subGain.gain.exponentialRampToValueAtTime(subBassGain, currentTime + 0.03);
          subGain.gain.setValueAtTime(subBassGain, currentTime + beatDuration * 0.35);
          subGain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.85);
          
          subBass.connect(subGain);
          subGain.connect(subFilter);
          subFilter.connect(lowPass);
          
          subBass.start(currentTime);
          subBass.stop(currentTime + beatDuration * 0.85);
          oscillatorsRef.current.push(subBass);
          gainNodesRef.current.push(subGain);
          filtersRef.current.push(subFilter);
          
        } else if (Math.abs(beatInMeasure - 1.5) < 0.1) {
          const note = bassNotes[1];
          if (!isFinite(note) || note <= 0) return;
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'triangle';
          osc.frequency.value = note;
          filter.type = 'lowpass';
          filter.frequency.value = 800;
          filter.Q.value = 1.0;
          
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.exponentialRampToValueAtTime(bassGain * 0.85, currentTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(bassGain * 0.85, currentTime + beatDuration * 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.65);
          
          osc.connect(gain);
          gain.connect(filter);
          filter.connect(lowPass);
          
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 0.65);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
          filtersRef.current.push(filter);
          
        } else if (Math.abs(beatInMeasure - 3) < 0.1) {
          const note = bassNotes[2];
          if (!isFinite(note) || note <= 0) return;
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'triangle';
          osc.frequency.value = note;
          filter.type = 'lowpass';
          filter.frequency.value = 1000;
          filter.Q.value = 1.0;
          
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.exponentialRampToValueAtTime(bassGain, currentTime + 0.015);
          gain.gain.setValueAtTime(bassGain, currentTime + beatDuration * 0.35);
          gain.gain.exponentialRampToValueAtTime(bassGain * 0.4, currentTime + beatDuration * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.9);
          
          osc.connect(gain);
          gain.connect(filter);
          filter.connect(lowPass);
          
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 0.9);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
          filtersRef.current.push(filter);
        }
        
        // Melody - Professional with filters and smooth vibrato
        if (Math.abs(beatInMeasure - 1) < 0.15 || Math.abs(beatInMeasure - 2.5) < 0.15) {
          let noteIndex = 0;
          if (Math.abs(beatInMeasure - 1) < 0.15) {
            noteIndex = 0;
          } else if (Math.abs(beatInMeasure - 2.5) < 0.15) {
            noteIndex = (1 + measureNumber) % melodyNotes.length;
          }
          
          const note = melodyNotes[noteIndex];
          if (!isFinite(note) || note <= 0) return;
          
          // Main melody with detuned layer for richness
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc1.type = 'sine';
          osc1.frequency.value = note;
          osc2.type = 'sine';
          osc2.frequency.value = note * 1.002; // Very slight detune
          
          filter.type = 'lowpass';
          filter.frequency.value = 5000;
          filter.Q.value = 0.5; // Gentle rolloff
          
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.exponentialRampToValueAtTime(melodyGain * 0.4, currentTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(melodyGain, currentTime + 0.08);
          gain.gain.setValueAtTime(melodyGain, currentTime + beatDuration * 0.5);
          gain.gain.exponentialRampToValueAtTime(melodyGain * 0.5, currentTime + beatDuration * 0.85);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.3);
          
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(filter);
          filter.connect(lowPass);
          
          osc1.start(currentTime);
          osc1.stop(currentTime + beatDuration * 1.3);
          osc2.start(currentTime);
          osc2.stop(currentTime + beatDuration * 1.3);
          
          oscillatorsRef.current.push(osc1, osc2);
          gainNodesRef.current.push(gain);
          filtersRef.current.push(filter);
          
          // Smooth vibrato for character
          const vibrato = ctx.createOscillator();
          const vibratoGain = ctx.createGain();
          const vibratoDepth = ctx.createGain();
          vibrato.type = 'sine';
          vibrato.frequency.value = 3.5; // Slower, more elegant
          vibratoGain.gain.value = 1.0;
          vibratoDepth.gain.value = 0.008; // Very subtle
          vibrato.connect(vibratoGain);
          vibratoGain.connect(vibratoDepth);
          vibratoDepth.connect(osc1.frequency);
          vibratoDepth.connect(osc2.frequency);
          vibrato.start(currentTime);
          vibrato.stop(currentTime + beatDuration * 1.3);
          oscillatorsRef.current.push(vibrato);
          gainNodesRef.current.push(vibratoGain);
        }
        
        // Harmony - Subtle and smooth
        if (Math.abs(beatInMeasure - 2.5) < 0.2) {
          const noteIndex = measureNumber % harmonyNotes.length;
          const note = harmonyNotes[noteIndex];
          if (!isFinite(note) || note <= 0) return;
          
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'sine';
          osc.frequency.value = note;
          filter.type = 'lowpass';
          filter.frequency.value = 4000;
          filter.Q.value = 0.5;
          
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.exponentialRampToValueAtTime(harmonyGain * 0.5, currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(harmonyGain, currentTime + 0.1);
          gain.gain.setValueAtTime(harmonyGain, currentTime + beatDuration * 0.45);
          gain.gain.exponentialRampToValueAtTime(harmonyGain * 0.4, currentTime + beatDuration * 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.0);
          
          osc.connect(gain);
          gain.connect(filter);
          filter.connect(lowPass);
          
          osc.start(currentTime);
          osc.stop(currentTime + beatDuration * 1.0);
          oscillatorsRef.current.push(osc);
          gainNodesRef.current.push(gain);
          filtersRef.current.push(filter);
        }
        
        // Schedule next iteration
        if (isEnabledRef.current && audioContextRef.current) {
          scheduleIntervalRef.current = window.setTimeout(
            scheduleNext,
            beatDuration * 1000 / 12 // Higher precision
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
    
    filtersRef.current.forEach(filter => {
      try { filter.disconnect(); } catch (e) {}
    });
    filtersRef.current = [];
    
    if (reverbConvolverRef.current) {
      try { reverbConvolverRef.current.disconnect(); } catch (e) {}
      reverbConvolverRef.current = null;
    }
    
    if (lowPassFilterRef.current) {
      try { lowPassFilterRef.current.disconnect(); } catch (e) {}
      lowPassFilterRef.current = null;
    }
    
    if (masterGainRef.current) {
      try { masterGainRef.current.disconnect(); } catch (e) {}
      masterGainRef.current = null;
    }
    
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

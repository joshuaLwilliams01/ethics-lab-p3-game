'use client';
import { useEffect, useRef, useState } from "react";
import { playButtonClick } from "@/lib/sounds";
import { useSound } from "@/contexts/SoundContext";

export default function AudioToggle(){
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const audioContextRef = useRef<AudioContext|null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const scheduleIntervalRef = useRef<number|null>(null);
  const startTimeRef = useRef<number>(0);
  const { enabled, setEnabled } = useSound();
  const [usingFallback, setUsingFallback] = useState(false);

  // Generate Mission Impossible Main Theme using Web Audio API
  const startFallbackAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Stop any existing audio first
      stopFallbackAudio();
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      startTimeRef.current = ctx.currentTime;
      
      // Mission Impossible Main Theme
      // Based on the iconic 5/4 time signature rhythm and melody
      // Bass line: E2, B2, E3 (signature rhythm pattern)
      // Melody: E4, G4, B4, D5, E5, G4, E4 (main theme)
      const bassNotes = [82.41, 123.47, 164.81]; // E2, B2, E3
      const melodyNotes = [329.63, 392.00, 493.88, 587.33, 659.25, 392.00, 329.63]; // E4, G4, B4, D5, E5, G4, E4
      
      // 5/4 time signature - Mission Impossible signature rhythm
      const beatDuration = 0.15; // Faster, more energetic
      const bassGain = 0.18; // Stronger bass for impact
      const melodyGain = 0.15; // Clear melody
      
      const isEnabledRef = { current: true }; // Track enabled state for scheduling
      const scheduleNext = () => {
        if (!isEnabledRef.current || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;
        // 5/4 time signature - 5 beats per measure
        const measureDuration = beatDuration * 5;
        const patternTime = (currentTime - startTimeRef.current) % (measureDuration * 2); // 2-measure pattern
        
        // Bass line - Mission Impossible signature rhythm (5/4 pattern)
        // Plays on beats 0, 1.5, 3 of each 5-beat measure
        const beatInMeasure = (patternTime % measureDuration) / beatDuration;
        const measureNumber = Math.floor(patternTime / measureDuration) % 2;
        
        // Signature bass pattern: E2 on beat 0, B2 on beat 1.5, E3 on beat 3
        if (Math.abs(beatInMeasure - 0) < 0.1) {
          // Beat 0 - E2
          const bassOsc = ctx.createOscillator();
          const bassGainNode = ctx.createGain();
          bassOsc.type = 'square'; // Square wave for punchy bass
          bassOsc.frequency.value = bassNotes[0]; // E2
          bassGainNode.gain.setValueAtTime(0, currentTime);
          bassGainNode.gain.linearRampToValueAtTime(bassGain, currentTime + 0.01);
          bassGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.8);
          bassOsc.connect(bassGainNode);
          bassGainNode.connect(ctx.destination);
          bassOsc.start(currentTime);
          bassOsc.stop(currentTime + beatDuration * 0.8);
          oscillatorsRef.current.push(bassOsc);
          gainNodesRef.current.push(bassGainNode);
        } else if (Math.abs(beatInMeasure - 1.5) < 0.1) {
          // Beat 1.5 - B2
          const bassOsc = ctx.createOscillator();
          const bassGainNode = ctx.createGain();
          bassOsc.type = 'square';
          bassOsc.frequency.value = bassNotes[1]; // B2
          bassGainNode.gain.setValueAtTime(0, currentTime);
          bassGainNode.gain.linearRampToValueAtTime(bassGain * 0.9, currentTime + 0.01);
          bassGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.6);
          bassOsc.connect(bassGainNode);
          bassGainNode.connect(ctx.destination);
          bassOsc.start(currentTime);
          bassOsc.stop(currentTime + beatDuration * 0.6);
          oscillatorsRef.current.push(bassOsc);
          gainNodesRef.current.push(bassGainNode);
        } else if (Math.abs(beatInMeasure - 3) < 0.1) {
          // Beat 3 - E3
          const bassOsc = ctx.createOscillator();
          const bassGainNode = ctx.createGain();
          bassOsc.type = 'square';
          bassOsc.frequency.value = bassNotes[2]; // E3
          bassGainNode.gain.setValueAtTime(0, currentTime);
          bassGainNode.gain.linearRampToValueAtTime(bassGain, currentTime + 0.01);
          bassGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 0.7);
          bassOsc.connect(bassGainNode);
          bassGainNode.connect(ctx.destination);
          bassOsc.start(currentTime);
          bassOsc.stop(currentTime + beatDuration * 0.7);
          oscillatorsRef.current.push(bassOsc);
          gainNodesRef.current.push(bassGainNode);
        }
        
        // Melody line - Mission Impossible main theme
        // Plays on beats 2, 4 of each measure (with variations)
        if (Math.abs(beatInMeasure - 2) < 0.15 || Math.abs(beatInMeasure - 4) < 0.15) {
          const melodyIndex = Math.floor(beatInMeasure) % melodyNotes.length;
          const melodyNote = melodyNotes[melodyIndex];
          
          const melodyOsc = ctx.createOscillator();
          const melodyGainNode = ctx.createGain();
          melodyOsc.type = 'sawtooth'; // Sawtooth for that sharp Mission Impossible sound
          melodyOsc.frequency.value = melodyNote;
          melodyGainNode.gain.setValueAtTime(0, currentTime);
          melodyGainNode.gain.linearRampToValueAtTime(melodyGain, currentTime + 0.02);
          melodyGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + beatDuration * 1.2);
          melodyOsc.connect(melodyGainNode);
          melodyGainNode.connect(ctx.destination);
          melodyOsc.start(currentTime);
          melodyOsc.stop(currentTime + beatDuration * 1.0);
          oscillatorsRef.current.push(melodyOsc);
          gainNodesRef.current.push(melodyGainNode);
        }
        
        // Schedule next iteration
        if (isEnabledRef.current && audioContextRef.current) {
          scheduleIntervalRef.current = window.setTimeout(
            scheduleNext,
            beatDuration * 1000 / 8 // Check 8 times per beat for precision
          );
        }
      };
      
      // Store enabled ref for cleanup
      (audioContextRef.current as any)._isEnabledRef = isEnabledRef;
      
      // Start scheduling
      scheduleNext();
      
      return isEnabledRef;
    } catch (e) {
      console.warn('Audio context not available:', e);
    }
  };

  const stopFallbackAudio = () => {
    // Clear scheduling interval
    if (scheduleIntervalRef.current !== null) {
      clearTimeout(scheduleIntervalRef.current);
      scheduleIntervalRef.current = null;
    }
    
    // Disable scheduling
    if (audioContextRef.current && (audioContextRef.current as any)._isEnabledRef) {
      (audioContextRef.current as any)._isEnabledRef.current = false;
    }
    
    // Stop all oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];
    
    // Disconnect all gain nodes
    gainNodesRef.current.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Already disconnected
      }
    });
    gainNodesRef.current = [];
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    
    startTimeRef.current = 0;
  };

  useEffect(()=>{
    if (enabled) {
      // Try to play audio file first
      if (audioRef.current) {
        audioRef.current.volume = 0.25;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio file is playing successfully
              setUsingFallback(false);
            })
            .catch(() => {
              // Audio file failed, use fallback
              setUsingFallback(true);
              startFallbackAudio();
            });
        }
      } else {
        // No audio element, use fallback
        setUsingFallback(true);
        startFallbackAudio();
      }
    } else {
      // Stop audio file
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Stop fallback audio
      stopFallbackAudio();
      setUsingFallback(false);
    }
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopFallbackAudio();
    };
  }, []);

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
          // Play sound before toggling (so it plays when turning on)
          if (!enabled) {
            playButtonClick();
          }
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
      <audio 
        ref={audioRef} 
        src="/sfx-suspense.mp3" 
        loop 
        preload="none"
        onError={() => {
          // If audio file fails to load, use fallback
          if (enabled && !usingFallback) {
            setUsingFallback(true);
            startFallbackAudio();
          }
        }}
      />
    </div>
  );
}

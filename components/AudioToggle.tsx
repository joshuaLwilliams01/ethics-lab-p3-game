'use client';
import { useEffect, useRef, useState } from "react";

export default function AudioToggle(){
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const audioContextRef = useRef<AudioContext|null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const scheduleIntervalRef = useRef<number|null>(null);
  const startTimeRef = useRef<number>(0);
  const [enabled, setEnabled] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Generate James Bond-inspired suspense theme using Web Audio API
  const startFallbackAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Stop any existing audio first
      stopFallbackAudio();
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      startTimeRef.current = ctx.currentTime;
      
      // Calmer James Bond-inspired theme (softened version)
      // Bass line: E2, F#2, G2, E2 (low suspenseful notes) - one octave lower for warmth
      // Melody: E3, G3, A3, B3, A3, G3, E3 (softer, lower octave)
      const bassNotes = [82.41, 92.50, 98.00, 82.41]; // E2, F#2, G2, E2
      const melodyNotes = [164.81, 196.00, 220.00, 246.94, 220.00, 196.00, 164.81]; // E3, G3, A3, B3, A3, G3, E3 (one octave lower)
      
      const tempo = 0.35; // Slower tempo for calmer feel
      const bassGain = 0.06; // Much quieter
      const melodyGain = 0.04; // Very subtle
      
      const isEnabledRef = { current: true }; // Track enabled state for scheduling
      const scheduleNext = () => {
        if (!isEnabledRef.current || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;
        const patternTime = (currentTime - startTimeRef.current) % (tempo * 8); // 8-beat pattern
        
        // Bass line - plays on beats 0, 2, 4, 6
        const bassBeat = Math.floor(patternTime / tempo) % 8;
        if ([0, 2, 4, 6].includes(bassBeat)) {
          const bassNote = bassNotes[Math.floor(bassBeat / 2) % bassNotes.length];
          
          const bassOsc = ctx.createOscillator();
          const bassGainNode = ctx.createGain();
          
          bassOsc.type = 'sine'; // Softer, calmer sound
          bassOsc.frequency.value = bassNote;
          
          // Much gentler envelope with longer fade
          bassGainNode.gain.setValueAtTime(0, currentTime);
          bassGainNode.gain.linearRampToValueAtTime(bassGain, currentTime + 0.05); // Slower attack
          bassGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + tempo * 1.2); // Longer decay
          
          bassOsc.connect(bassGainNode);
          bassGainNode.connect(ctx.destination);
          bassOsc.start(currentTime);
          bassOsc.stop(currentTime + tempo * 0.8);
          
          oscillatorsRef.current.push(bassOsc);
          gainNodesRef.current.push(bassGainNode);
        }
        
        // Melody line - plays on beats 1, 3, 5, 7 (staggered)
        const melodyBeat = Math.floor(patternTime / tempo) % 8;
        if ([1, 3, 5, 7].includes(melodyBeat)) {
          const melodyIndex = Math.floor((melodyBeat - 1) / 2) % melodyNotes.length;
          const melodyNote = melodyNotes[melodyIndex];
          
          const melodyOsc = ctx.createOscillator();
          const melodyGainNode = ctx.createGain();
          
          melodyOsc.type = 'sine'; // Smooth, calm sound instead of harsh square
          melodyOsc.frequency.value = melodyNote;
          
          // Very gentle envelope
          melodyGainNode.gain.setValueAtTime(0, currentTime);
          melodyGainNode.gain.linearRampToValueAtTime(melodyGain, currentTime + 0.08); // Very slow attack
          melodyGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + tempo * 0.9); // Longer, smoother decay
          
          melodyOsc.connect(melodyGainNode);
          melodyGainNode.connect(ctx.destination);
          melodyOsc.start(currentTime);
          melodyOsc.stop(currentTime + tempo * 0.6);
          
          oscillatorsRef.current.push(melodyOsc);
          gainNodesRef.current.push(melodyGainNode);
        }
        
        // Schedule next iteration
        if (isEnabledRef.current && audioContextRef.current) {
          scheduleIntervalRef.current = window.setTimeout(
            scheduleNext,
            tempo * 1000 / 4 // Check 4 times per beat for precision
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
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm text-[#53565A]">
        {enabled ? "🔊Sound Off" : "🔇Sound Off"}
      </div>
      <button 
        onClick={()=>setEnabled(v=>!v)} 
        className="text-xs text-[#53565A] hover:text-[#8C1515] transition cursor-pointer underline" 
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

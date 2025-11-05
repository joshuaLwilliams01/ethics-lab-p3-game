'use client';
import { useEffect, useRef, useState } from "react";
import { playButtonClick } from "@/lib/sounds";

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
      
      // Enhanced James Bond-inspired theme - clearer, less underwater
      // Raised frequencies to avoid muffled sound
      // Bass line: E3, F#3, G3, E3 (raised one octave for clarity)
      // Melody: E4, G4, A4, B4, A4, G4, E4 (raised one octave for clarity)
      const bassNotes = [164.81, 185.00, 196.00, 164.81]; // E3, F#3, G3, E3 (raised octave)
      const melodyNotes = [329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63]; // E4, G4, A4, B4, A4, G4, E4 (raised octave)
      
      const tempo = 0.4; // Slightly faster for more engagement
      const bassGain = 0.15; // Increased for presence
      const melodyGain = 0.12; // Increased for clarity
      
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
          
          bassOsc.type = 'triangle'; // Triangle wave for clearer, less muffled sound
          bassOsc.frequency.value = bassNote;
          
          // Crisper envelope for better definition
          bassGainNode.gain.setValueAtTime(0, currentTime);
          bassGainNode.gain.linearRampToValueAtTime(bassGain, currentTime + 0.02); // Faster attack for clarity
          bassGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + tempo * 1.0); // Controlled decay
          
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
          
          melodyOsc.type = 'triangle'; // Triangle wave for clearer, less muffled sound
          melodyOsc.frequency.value = melodyNote;
          
          // Crisper envelope for better definition
          melodyGainNode.gain.setValueAtTime(0, currentTime);
          melodyGainNode.gain.linearRampToValueAtTime(melodyGain, currentTime + 0.03); // Faster attack for clarity
          melodyGainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + tempo * 0.8); // Controlled decay
          
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
        onClick={() => {
          playButtonClick();
          setEnabled(v=>!v);
        }} 
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

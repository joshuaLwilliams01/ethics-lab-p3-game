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

  // Generate pleasant, ambient background music using Web Audio API
  const startFallbackAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Stop any existing audio first
      stopFallbackAudio();
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      startTimeRef.current = ctx.currentTime;
      
      // Simple, pleasant ambient background music
      // Using a gentle, repeating pattern with smooth sine waves
      const baseNote = 220.0; // A3 - pleasant, mid-range frequency
      const interval = 0.6; // 600ms between notes - slow, ambient pace
      const noteGain = 0.08; // Low volume for pleasant background
      
      const isEnabledRef = { current: true }; // Track enabled state for scheduling
      
      // Create a simple, pleasant sequence
      const sequence = [
        { freq: baseNote, duration: interval * 1.5 },      // A3 - longer
        { freq: baseNote * 1.25, duration: interval },    // C#4
        { freq: baseNote * 1.5, duration: interval },     // E4
        { freq: baseNote * 1.25, duration: interval },    // C#4
        { freq: baseNote, duration: interval * 2 },       // A3 - longer pause
      ];
      
      let sequenceIndex = 0;
      
      const scheduleNext = () => {
        if (!isEnabledRef.current || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;
        const note = sequence[sequenceIndex % sequence.length];
        
        // Create a smooth sine wave note
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine'; // Pure sine wave - smoothest possible
        osc.frequency.value = note.freq;
        
        // Very smooth envelope - gentle attack and decay
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(noteGain, currentTime + 0.1); // Gentle attack
        gainNode.gain.setValueAtTime(noteGain, currentTime + note.duration * 0.3); // Sustain
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration * 0.9); // Gentle decay
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(currentTime);
        osc.stop(currentTime + note.duration);
        
        oscillatorsRef.current.push(osc);
        gainNodesRef.current.push(gainNode);
        
        sequenceIndex++;
        
        // Schedule next note
        if (isEnabledRef.current && audioContextRef.current) {
          scheduleIntervalRef.current = window.setTimeout(
            scheduleNext,
            note.duration * 1000
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

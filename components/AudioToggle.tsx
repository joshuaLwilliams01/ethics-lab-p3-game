'use client';
import { useEffect, useRef, useState } from "react";

export default function AudioToggle(){
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const audioContextRef = useRef<AudioContext|null>(null);
  const oscillatorRef = useRef<OscillatorNode|null>(null);
  const gainNodeRef = useRef<GainNode|null>(null);
  const animationFrameRef = useRef<number|null>(null);
  const [enabled, setEnabled] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Generate a subtle suspenseful tone using Web Audio API
  const startFallbackAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Stop any existing audio first
      stopFallbackAudio();
      
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 220; // A3 note
      gainNode.gain.value = 0.08; // Very quiet
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      // Slowly modulate frequency for subtle suspense
      const modulate = () => {
        if (!oscillatorRef.current) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          return;
        }
        const baseFreq = 220;
        const variation = Math.sin(Date.now() / 3000) * 5;
        oscillatorRef.current.frequency.value = baseFreq + variation;
        animationFrameRef.current = requestAnimationFrame(modulate);
      };
      animationFrameRef.current = requestAnimationFrame(modulate);
    } catch (e) {
      console.warn('Audio context not available:', e);
    }
  };

  const stopFallbackAudio = () => {
    // Cancel animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop oscillator
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    
    gainNodeRef.current = null;
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
      <button 
        onClick={()=>setEnabled(v=>!v)} 
        className="text-sm text-[#53565A] hover:text-[#8C1515] transition cursor-pointer" 
        aria-pressed={enabled}
        aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      >
        {enabled ? "🔊Sound Off" : "🔇Sound Off"}
      </button>
      <span className="text-xs text-[#53565A]">(Click to enable)</span>
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

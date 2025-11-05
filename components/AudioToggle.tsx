'use client';
import { useEffect, useRef, useState } from "react";
import { playButtonClick } from "@/lib/sounds";
import { useSound } from "@/contexts/SoundContext";

export default function AudioToggle(){
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { enabled, setEnabled } = useSound();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      // Try to play - handle autoplay restrictions
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay succeeded
            audio.loop = true;
            audio.volume = 0.4; // Professional volume level
          })
          .catch((error) => {
            console.warn('Audio autoplay prevented:', error);
            // User interaction required - will play on next click
          });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [enabled]);

  // Handle user interaction to start audio (required for autoplay restrictions)
  const handleToggle = () => {
    playButtonClick();
    setEnabled(!enabled);
    
    // If enabling and audio hasn't started, try to start it
    if (!enabled && audioRef.current) {
      const audio = audioRef.current;
      audio.play().catch((error) => {
        console.warn('Audio play failed:', error);
      });
    }
  };

  return (
    <>
      {/* Hidden audio element - will use background-music.mp3 from public folder */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        style={{ display: 'none' }}
      >
        <source src="/background-music.mp3" type="audio/mpeg" />
        <source src="/background-music.ogg" type="audio/ogg" />
        <source src="/background-music.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      
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
          onClick={handleToggle}
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
    </>
  );
}

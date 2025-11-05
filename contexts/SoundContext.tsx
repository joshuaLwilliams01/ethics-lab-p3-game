'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SoundContextType = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('soundEnabled');
    if (saved !== null) {
      setEnabledState(saved === 'true');
    }
  }, []);

  // Save to localStorage when changed
  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    localStorage.setItem('soundEnabled', String(value));
  };

  return (
    <SoundContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}


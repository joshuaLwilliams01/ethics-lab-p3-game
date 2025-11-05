import { useEffect, useRef } from 'react';
import { playButtonClick } from '@/lib/sounds';

/**
 * Hook to add click sound effect to a button element
 * Usage: const buttonRef = useButtonSound();
 * Then apply ref={buttonRef} to the button
 */
export function useButtonSound() {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = () => {
      playButtonClick();
    };

    element.addEventListener('click', handleClick);
    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
}

/**
 * Hook that returns a click handler with sound
 * Usage: const handleClick = useClickWithSound(() => { ... });
 */
export function useClickWithSound(callback: () => void) {
  return () => {
    playButtonClick();
    callback();
  };
}


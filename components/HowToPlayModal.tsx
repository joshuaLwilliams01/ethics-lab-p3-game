'use client';
import { useEffect } from 'react';
import HowToPlay from './HowToPlay';

export default function HowToPlayModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
        style={{ animation: 'fade-in 0.3s ease-out' }}
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-[#8C1515]"
          style={{ animation: 'modal-slide-in 0.3s ease-out' }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#8C1515] via-[#C41E3A] to-[#8C1515] p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">📖</span>
                <span>How to Play</span>
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <HowToPlay />
          </div>

          {/* Footer with close button */}
          <div className="border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="btn px-6 py-2 text-sm font-semibold"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>

    </>
  );
}


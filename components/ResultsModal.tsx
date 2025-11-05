'use client';
import { useEffect } from 'react';
import { playButtonClick } from '@/lib/sounds';

type ResultsData = {
  summary: string;
  benefits: string[];
  harms: string[];
};

export default function ResultsModal({ 
  isOpen, 
  onClose, 
  results 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  results: ResultsData | null;
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Don't hide body overflow - let the modal container handle scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !results) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        style={{ animation: 'fade-in 0.3s ease-out' }}
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center px-4 pointer-events-none overflow-y-auto"
        style={{ paddingTop: '5rem', paddingBottom: '2rem' }}
      >
        <div
          className="bg-gradient-to-br from-white via-[#F7F6F3] to-white rounded-lg shadow-2xl max-w-2xl w-full flex flex-col relative border-2 border-[#8C1515] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            animation: 'modal-slide-in 0.3s ease-out',
            maxHeight: 'calc(100vh - 7rem)',
            marginTop: '0',
            marginBottom: '2rem'
          }}
        >
          {/* Header with gradient - always visible */}
          <div className="bg-gradient-to-r from-[#8C1515] via-[#C41E3A] to-[#8C1515] p-4 rounded-t-lg flex-shrink-0 z-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                <div>
                  <div className="text-xl font-bold">Result(s) of Your Decision</div>
                  <div className="text-sm font-semibold opacity-95 mt-0.5">See the impact of your choice</div>
                </div>
              </h2>
              <button
                onClick={() => {
                  playButtonClick();
                  onClose();
                }}
                className="text-white hover:text-gray-200 transition-colors duration-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 flex-shrink-0"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content - scrollable */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 18rem)' }}>
            {/* Summary */}
            <div className="bg-gradient-to-r from-[#8C1515]/10 to-[#175E54]/10 p-4 rounded-lg border-l-4 border-[#8C1515]">
              <p className="text-[#1F2937] text-sm font-semibold leading-relaxed">{results.summary}</p>
            </div>

            {/* Benefits and Harms Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Benefits */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-lg border-2 border-green-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-lg font-bold text-green-800">Benefits</h3>
                </div>
                <ul className="space-y-2">
                  {results.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#1F2937]">
                      <span className="text-green-600 font-bold mt-0.5 text-base">✓</span>
                      <span className="leading-relaxed text-sm font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Harms */}
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-lg border-2 border-red-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-lg font-bold text-red-800">Harms</h3>
                </div>
                <ul className="space-y-2">
                  {results.harms.map((harm, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#1F2937]">
                      <span className="text-red-600 font-bold mt-0.5 text-base">⚠</span>
                      <span className="leading-relaxed text-sm font-medium">{harm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 bg-gradient-to-r from-gray-50 to-transparent flex justify-end flex-shrink-0">
            <button
              onClick={() => {
                playButtonClick();
                onClose();
              }}
              className="btn px-6 py-2 text-sm font-semibold"
            >
              Got it! Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


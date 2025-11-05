'use client';
import { useEffect } from 'react';

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
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="bg-gradient-to-br from-white via-[#F7F6F3] to-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-[#8C1515] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: 'modal-slide-in 0.3s ease-out' }}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#8C1515] via-[#C41E3A] to-[#8C1515] p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🎯</span>
                <div>
                  <div>Result(s) of Your Decision</div>
                  <div className="text-sm font-normal opacity-90 mt-1">See the impact of your choice</div>
                </div>
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-[#8C1515]/10 to-[#175E54]/10 p-4 rounded-lg border-l-4 border-[#8C1515]">
              <p className="text-[#2E2D29] text-base leading-relaxed font-medium">{results.summary}</p>
            </div>

            {/* Benefits and Harms Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Benefits */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-lg border-2 border-green-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-xl font-bold text-green-800">Benefits</h3>
                </div>
                <ul className="space-y-2">
                  {results.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#2E2D29]">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Harms */}
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-5 rounded-lg border-2 border-red-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-xl font-bold text-red-800">Harms</h3>
                </div>
                <ul className="space-y-2">
                  {results.harms.map((harm, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#2E2D29]">
                      <span className="text-red-600 font-bold mt-1">⚠</span>
                      <span className="leading-relaxed">{harm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-transparent flex justify-end">
            <button
              onClick={onClose}
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


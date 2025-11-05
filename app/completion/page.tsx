'use client';
import { useEffect, useState, Suspense } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { playButtonClick } from '@/lib/sounds';
import { checkAllLevelsCompleted, getCompletionStats } from '@/lib/completion';

function CompletionPageContent() {
  const [playerName, setPlayerName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [stats, setStats] = useState({ completedLevels: [], totalLevels: 7, percentage: 0 });
  const searchParams = useSearchParams();
  const isTestMode = searchParams?.get('test') === 'true';

  useEffect(() => {
    const completed = checkAllLevelsCompleted();
    const completionStats = getCompletionStats();
    setStats(completionStats);
    
    // Allow access in test mode or if completed
    if (isTestMode || completed) {
      setHasAccess(true);
      // In test mode, set stats to 100% for display
      if (isTestMode) {
        setStats({ completedLevels: [1, 2, 3, 4, 5, 6, 7], totalLevels: 7, percentage: 100 });
      }
    } else {
      setHasAccess(false);
      // If not completed and not in test mode, redirect after 3 seconds
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTestMode]);

  const generateCertificate = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name to generate a certificate.');
      return;
    }
    
    playButtonClick();
    setIsGenerating(true);
    
    try {
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([612, 792]); // Letter size
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const boldItalic = await pdf.embedFont(StandardFonts.HelveticaBoldOblique);
      
      // Background gradient effect (simulated with rectangles)
      const bgColor = rgb(0.95, 0.95, 0.95);
      page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: bgColor });
      
      // Stanford colors
      const stanfordRed = rgb(0.55, 0.08, 0.08); // #8C1515
      const stanfordGreen = rgb(0.09, 0.37, 0.33); // #175E54
      
      // Helper to center text
      const centerText = (text: string, y: number, size: number, font: any, options: any = {}) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const x = (612 - textWidth) / 2;
        page.drawText(text, { x, y, size, font, ...options });
      };
      
      // Certificate Header
      centerText('ETHICS-TECH-POLICY', 750, 22, bold, { color: stanfordRed });
      centerText('DECISIONS SANDBOX', 725, 22, bold, { color: stanfordRed });
      
      // Certificate Title
      centerText('Certificate of Completion', 680, 30, bold, { color: rgb(0.2, 0.2, 0.2) });
      
      // Main certification text
      centerText('This certifies that', 620, 14, font, { color: rgb(0.3, 0.3, 0.3) });
      
      // Recipient's Name (bold and prominent)
      centerText(playerName.trim(), 580, 36, bold, { color: stanfordRed });
      
      centerText('has successfully completed the training in', 540, 14, font, { color: rgb(0.3, 0.3, 0.3) });
      
      // Program name (bold)
      centerText('Ethics-Tech-Policy Decisions Sandbox', 510, 16, bold, { color: rgb(0.2, 0.2, 0.2) });
      
      // Description paragraph
      const description = 'Created by Joshua Williams, this program explored the complexities of technology, policy, and society based on lessons from the Ethics, Technology + Public Policy for Practitioners SOE-XETECH0001 course.';
      // Split into lines if needed (rough line breaks at ~70 chars)
      const words = description.split(' ');
      let line = '';
      let yPos = 460;
      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        if (font.widthOfTextAtSize(testLine, 11) > 520) {
          if (line) {
            centerText(line, yPos, 11, font, { color: rgb(0.35, 0.35, 0.35) });
            yPos -= 18;
          }
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) {
        centerText(line, yPos, 11, font, { color: rgb(0.35, 0.35, 0.35) });
      }
      
      // Date of Completion
      const completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      centerText('Date of Completion:', 380, 12, font, { color: rgb(0.3, 0.3, 0.3) });
      centerText(completionDate, 360, 12, font, { color: rgb(0.4, 0.4, 0.4) });
      
      // Congratulations message
      centerText('Congratulations on this achievement!', 320, 14, bold, { color: stanfordGreen });
      
      // Disclaimer
      const disclaimer = 'Disclaimer: This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.';
      // Split disclaimer into lines
      const disclaimerWords = disclaimer.split(' ');
      let disclaimerLine = '';
      let disclaimerYPos = 260;
      for (const word of disclaimerWords) {
        const testDisclaimerLine = disclaimerLine + (disclaimerLine ? ' ' : '') + word;
        if (font.widthOfTextAtSize(testDisclaimerLine, 9) > 550) {
          if (disclaimerLine) {
            centerText(disclaimerLine, disclaimerYPos, 9, font, { color: rgb(0.5, 0.5, 0.5) });
            disclaimerYPos -= 14;
          }
          disclaimerLine = word;
        } else {
          disclaimerLine = testDisclaimerLine;
        }
      }
      if (disclaimerLine) {
        centerText(disclaimerLine, disclaimerYPos, 9, font, { color: rgb(0.5, 0.5, 0.5) });
      }
      
      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ethics-sandbox-certificate-${playerName.trim().replace(/\s+/g, '-').toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareOnTwitter = () => {
    playButtonClick();
    const text = `I just completed all 7 levels of the Ethics-Tech-Policy Decisions Sandbox! ${playerName ? `- ${playerName}` : ''} 🎓✨`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    playButtonClick();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    playButtonClick();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-[#8C1515]">Access Restricted</h1>
          <p className="text-lg text-gray-600">You must complete all 7 levels to access this page.</p>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
          <div className="space-y-2">
            <Link href="/" className="btn px-6 py-3 text-base font-semibold inline-block">
              Go Home
            </Link>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-500 mb-2">Test Mode (for review):</p>
              <Link href="/completion?test=true" className="text-sm text-[#8C1515] hover:underline">
                View Completion Page in Test Mode
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #8C1515 0%, #175E54 50%, #8C1515 100%)' }}>
      <div className="max-w-4xl w-full">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          {/* Professional Checkmark Circle Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}>
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            <span className="bg-gradient-to-r from-white via-yellow-50 to-white bg-clip-text text-transparent drop-shadow-lg" style={{ animation: 'fade-in 1s ease-out' }}>
              CONGRATULATIONS!
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/95 mb-2 font-medium" style={{ animation: 'slide-in 0.8s ease-out 0.2s both' }}>You've Completed All Levels</p>
          <p className="text-lg text-white/85 font-light" style={{ animation: 'slide-in 0.8s ease-out 0.4s both' }}>Ethics-Tech-Policy Decisions Sandbox</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-white via-[#F7F6F3] to-white rounded-lg shadow-2xl border-4 border-[#8C1515] p-8 md:p-12 space-y-8 relative">
          {/* Test Mode Banner */}
          {isTestMode && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>TEST MODE</span>
            </div>
          )}
          
          {/* Stats */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8C1515] to-[#175E54] text-white px-8 py-4 rounded-full shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-3xl font-bold">{stats.percentage}%</span>
              <span className="text-base font-semibold">Complete</span>
            </div>
            <p className="mt-4 text-gray-600 font-medium">All 7 levels mastered</p>
          </div>

          {/* Name Input */}
          <div className="space-y-4">
            <label htmlFor="playerName" className="block text-lg font-semibold text-[#2E2D29]">
              Enter Your Name for Your Certificate
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name here..."
              className="w-full px-4 py-3 border-2 border-[#8C1515] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:ring-offset-2"
              maxLength={50}
            />
            <p className="text-sm text-gray-500">This name will appear on your certificate</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Download Certificate - Enhanced Visibility */}
            <div className="bg-gradient-to-r from-[#8C1515]/10 to-[#175E54]/10 p-4 rounded-lg border-2 border-[#8C1515]">
              <button
                onClick={generateCertificate}
                disabled={isGenerating || !playerName.trim()}
                className={`w-full btn px-8 py-5 text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  !playerName.trim() ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #8C1515 0%, #C41E3A 50%, #8C1515 100%)',
                  color: 'white'
                }}
              >
                {isGenerating ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Generating Certificate...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Certificate</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </>
                )}
              </button>
              {!playerName.trim() && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Please enter your name above to generate your certificate
                </p>
              )}
            </div>
            
            {/* Share Section */}
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Share Buttons */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Share Your Achievement</p>
                <div className="flex gap-2">
                  <button
                    onClick={shareOnTwitter}
                    className="flex-1 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1a8cd8] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span className="hidden sm:inline">Twitter</span>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex-1 px-4 py-3 bg-[#0077B5] text-white rounded-lg font-semibold hover:bg-[#006399] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="hidden sm:inline">LinkedIn</span>
                  </button>
                  <button
                    onClick={shareOnFacebook}
                    className="flex-1 px-4 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166fe5] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/"
              onClick={() => playButtonClick()}
              className="text-[#8C1515] hover:text-[#820f0f] font-semibold underline text-lg"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CompletionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CompletionPageContent />
    </Suspense>
  );
}


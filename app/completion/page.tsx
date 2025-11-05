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
        <div className="text-center mb-8 animate-pulse">
          <div className="text-8xl mb-4" style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}>🎉</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
              CONGRATULATIONS!
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-2">You've Completed All Levels</p>
          <p className="text-lg text-white/80">Ethics-Tech-Policy Decisions Sandbox</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-white via-[#F7F6F3] to-white rounded-lg shadow-2xl border-4 border-[#8C1515] p-8 md:p-12 space-y-8 relative">
          {/* Test Mode Banner */}
          {isTestMode && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              🧪 TEST MODE
            </div>
          )}
          
          {/* Stats */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#8C1515] to-[#175E54] text-white px-6 py-3 rounded-full">
              <span className="text-2xl font-bold">{stats.percentage}%</span>
              <span className="ml-2 text-sm">Complete</span>
            </div>
            <p className="mt-4 text-gray-600">All 7 levels mastered! 🌲</p>
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
                className={`w-full btn px-8 py-5 text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  !playerName.trim() ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #8C1515 0%, #C41E3A 50%, #8C1515 100%)',
                  color: 'white'
                }}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin text-2xl">⏳</span>
                    <span>Generating Certificate...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">📜</span>
                    <span>Download Certificate</span>
                    <span className="text-2xl">⬇️</span>
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
                    className="flex-1 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1a8cd8] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🐦</span>
                    <span className="hidden sm:inline">Twitter</span>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex-1 px-4 py-3 bg-[#0077B5] text-white rounded-lg font-semibold hover:bg-[#006399] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>💼</span>
                    <span className="hidden sm:inline">LinkedIn</span>
                  </button>
                  <button
                    onClick={shareOnFacebook}
                    className="flex-1 px-4 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166fe5] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📘</span>
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


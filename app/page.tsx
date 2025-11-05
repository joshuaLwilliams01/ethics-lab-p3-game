'use client';
import Link from "next/link";
import HowToPlayModal from "@/components/HowToPlayModal";
import { useState } from "react";
import { playButtonClick } from "@/lib/sounds";

export default function Home(){
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      {/* Main Title - Enhanced */}
      <div className="text-center mb-8 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-6xl opacity-20" style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}>🌲</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#8C1515] tracking-tight relative inline-block">
          <span className="bg-gradient-to-r from-[#8C1515] via-[#C41E3A] to-[#8C1515] bg-clip-text text-transparent" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
            ETHICS-TECH-POLICY
          </span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2E2D29] tracking-tight relative">
          DECISIONS SANDBOX
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#8C1515] to-transparent"></div>
        </h2>
        <div className="text-base md:text-lg max-w-3xl mx-auto text-[#53565A] mb-8 leading-relaxed text-left">
          <p>
            The Ethics-Tech-Policy Decisions Sandbox, created by{' '}
            <a 
              href="https://www.linkedin.com/in/joshua-williams-4847944/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8C1515] hover:text-[#820f0f] underline"
            >
              Joshua Williams
            </a>
            , is a web-based simulator that addresses real-world dilemmas at the intersection of technology, policy, and society, drawing on lessons from the{' '}
            <a 
              href="https://online.stanford.edu/courses/soe-xetech0001-ethics-technology-public-policy-practitioners"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C1515] hover:text-[#820f0f] underline"
            >
              Stanford Ethics, Technology + Public Policy for Practitioners SOE-XETECH0001 course
            </a>
            .
          </p>
          <p className="mt-4">
            Utilizing{' '}
            <a 
              href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C1515] hover:text-[#820f0f] underline"
            >
              Stanford's Ethics Toolkit
            </a>
            {' '}from Manuela Travaglianti, PhD, and Thomas Both, players explore tradeoffs and justify their decisions, promoting ethics, tech, and public policy.
          </p>
        </div>
      </div>

      {/* How to Play Button - Enhanced */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <button 
          onClick={() => {
            playButtonClick();
            setShowHowToPlay(!showHowToPlay);
          }}
          className="btn px-6 py-3 text-base font-semibold relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span>HOW TO PLAY</span>
          </span>
        </button>
      </div>

      {/* Level Selection - Enhanced with animations */}
      <div className="mb-8 w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="text-xl font-semibold text-[#2E2D29] mb-2 flex items-center justify-center gap-2">
            <span className="stanford-tree">🌲</span>
            <span>Choose Your Level</span>
            <span className="stanford-tree">🌲</span>
          </div>
        </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { level: 1, emoji: "⚖️", title: "Moral Foundations", desc: "Complicity & Ethics", color: "from-red-50 via-red-100 to-red-50", accent: "rgba(140,21,21,0.2)" },
                    { level: 2, emoji: "⚡", title: "Algorithmic Fairness", desc: "Decision-Making", color: "from-blue-50 via-blue-100 to-blue-50", accent: "rgba(59,130,246,0.2)" },
                    { level: 3, emoji: "🛡️", title: "Child Safety", desc: "Responsibility", color: "from-green-50 via-green-100 to-green-50", accent: "rgba(23,94,84,0.2)" },
                    { level: 4, emoji: "🏛️", title: "Political Economy", desc: "Power Distribution", color: "from-purple-50 via-purple-100 to-purple-50", accent: "rgba(147,51,234,0.2)" },
                    { level: 5, emoji: "🔒", title: "Privacy & Liberty", desc: "Data Collection", color: "from-orange-50 via-orange-100 to-orange-50", accent: "rgba(249,115,22,0.2)" },
                    { level: 6, emoji: "🤖", title: "Future of Work", desc: "Automation", color: "from-indigo-50 via-indigo-100 to-indigo-50", accent: "rgba(99,102,241,0.2)" },
                    { level: 7, emoji: "💪", title: "Moral Imagination", desc: "Civic Courage & Governance", color: "from-teal-50 via-teal-100 to-teal-50", accent: "rgba(20,184,166,0.2)" },
                  ].map(({ level, emoji, title, desc, color, accent }) => (
                    <Link
                      key={level}
                      href={`/play/individual/${level}`}
                      className={`level-card card text-center p-6 bg-gradient-to-br ${color} border-2 hover:border-[#8C1515] relative overflow-hidden ${level === 7 ? 'lg:col-start-2' : ''}`}
                      style={{ 
                        boxShadow: `0 4px 12px ${accent}, 0 0 0 1px rgba(140,21,21,0.1)`
                      }}
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8C1515] to-transparent opacity-10 rounded-bl-full"></div>
                      <div className="text-5xl mb-3 transform hover:scale-110 transition-transform duration-300" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{emoji}</div>
                      <div className="text-2xl font-bold text-[#8C1515] mb-2 glow-cardinal">Level {level}</div>
                      <div className="font-semibold text-[#2E2D29] mb-1 text-lg">{title}</div>
                      <div className="text-sm text-[#53565A]">{desc}</div>
                      <div className="mt-3 text-xs text-[#8C1515] font-medium opacity-0 hover:opacity-100 transition-opacity">Start Journey →</div>
                    </Link>
                  ))}
                </div>
              </div>

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      {/* Disclaimer */}
      <div className="text-center text-xs text-[#53565A] max-w-2xl">
        <p>
          This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
        </p>
      </div>
    </div>
  );
}

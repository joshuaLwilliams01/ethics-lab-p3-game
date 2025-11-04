import Link from "next/link";
import HowToPlay from "@/components/HowToPlay";
import AudioToggle from "@/components/AudioToggle";

export default function Home(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#8C1515] tracking-tight">
          ETHICS-TECH-POLICY
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2E2D29] tracking-tight">
          DECISIONS SANDBOX
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
            , is a web-based simulator addressing real-world dilemmas at the intersection of technology, policy, and society. Utilizing{' '}
            <a 
              href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C1515] hover:text-[#820f0f] underline"
            >
              Stanford's Ethics Toolkit
            </a>
            {' '}from Manuela Travaglianti, PhD, and Thomas Both, players explore tradeoffs and justify their decisions, promoting privacy, accessibility, and responsible technology education.
          </p>
        </div>
      </div>

      {/* Sound Toggle - positioned like AISES */}
      <div className="mb-6">
        <AudioToggle />
      </div>

      {/* Level Selection - similar to Theme Selection in AISES */}
      <div className="mb-8 w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="text-xl font-semibold text-[#2E2D29] mb-2">🎯 Choose Your Level</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { level: 1, emoji: "⚖️", title: "Moral Foundations", desc: "Complicity & Ethics", color: "from-red-50 to-red-100" },
            { level: 2, emoji: "⚡", title: "Algorithmic Fairness", desc: "Decision-Making", color: "from-blue-50 to-blue-100" },
            { level: 3, emoji: "🛡️", title: "Child Safety", desc: "Responsibility", color: "from-green-50 to-green-100" },
            { level: 4, emoji: "🏛️", title: "Political Economy", desc: "Power Distribution", color: "from-purple-50 to-purple-100" },
            { level: 5, emoji: "🔒", title: "Privacy & Liberty", desc: "Data Collection", color: "from-orange-50 to-orange-100" },
            { level: 6, emoji: "🤖", title: "Future of Work", desc: "Automation", color: "from-indigo-50 to-indigo-100" },
          ].map(({ level, emoji, title, desc, color }) => (
            <Link
              key={level}
              href={`/play/individual/${level}`}
              className={`card text-center hover:shadow-lg transition p-6 bg-gradient-to-br ${color} border-2 hover:border-[#8C1515]`}
            >
              <div className="text-4xl mb-2">{emoji}</div>
              <div className="text-xl font-bold text-[#8C1515] mb-2">Level {level}</div>
              <div className="font-semibold text-[#2E2D29] mb-1">{title}</div>
              <div className="text-sm text-[#53565A]">{desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* How to Play & Start Button - AISES style */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <a href="#how" className="btn-ghost px-6 py-3 text-base font-semibold">
          📖 HOW TO PLAY
        </a>
        <Link href="/play/individual/1" className="btn px-6 py-3 text-base font-semibold">
          🎮 START YOUR JOURNEY
        </Link>
      </div>

      {/* How to Play Section */}
      <div id="how" className="w-full max-w-3xl card mb-8">
        <HowToPlay />
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-[#53565A] max-w-2xl">
        <p className="mb-2">
          The Ethics-Tech-Policy Decisions Sandbox is not associated with the McCoy Family Center for Ethics in Society staff.
        </p>
        <p>
          An independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function About(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      {/* Main Title - matching homepage */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#8C1515] tracking-tight">
          ETHICS-TECH-POLICY
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2E2D29] tracking-tight">
          DECISIONS SANDBOX
        </h2>
      </div>

      {/* About Content */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4 text-[#8C1515]">About the Project</h2>
          <div className="space-y-4 text-[#53565A] leading-relaxed">
            <p>
              The <em>Ethics-Tech-Policy Decisions Sandbox</em>, created by{' '}
              <a 
                href="https://www.linkedin.com/in/joshua-williams-4847944/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline"
              >
                Joshua Williams
              </a>
              , is a web-based simulator that presents real-world dilemmas at the intersection of technology, policy, and society through short, playable scenarios.
            </p>
            <p>
              Utilizing{' '}
              <a 
                href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline"
              >
                Stanford's Ethics Toolkit
              </a>
              , created by Manuela Travaglianti, PhD, and Thomas Both at the McCoy Family Center for Ethics in Society at Stanford University, players explore tradeoffs, test options, and clearly explain their decisions.
            </p>
            <p>
              Designed with privacy, accessibility, and adaptability in mind, it serves as both a teaching tool and a portfolio-ready demo for responsible technology.
            </p>
          </div>
        </div>

        {/* Resources Section */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-[#2E2D29]">Resources</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-[#2E2D29]">Course:</strong>{' '}
              <a 
                href="https://online.stanford.edu/courses/soe-xetech0001-ethics-technology-public-policy-practitioners" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline"
              >
                Ethics, Technology + Public Policy for Practitioners
              </a>
            </div>
            <div>
              <strong className="text-[#2E2D29]">Stanford Ethics Toolkit:</strong>{' '}
              <a 
                href="https://ethicsinsociety.stanford.edu/tech-ethics/ethics-toolkit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline"
              >
                Link
              </a>
            </div>
            <div>
              <strong className="text-[#2E2D29]">People + Planet + Parity Framework:</strong>{' '}
              <a 
                href="https://apartresearch.com/project/people-planet-parity-governance-framework-h3ks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8C1515] hover:text-[#820f0f] underline"
              >
                Link
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - matching homepage style */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/" className="btn px-6 py-3 text-base font-semibold">
            🏠 Back Home
          </Link>
          <Link href="/play/individual/1" className="btn-ghost px-6 py-3 text-base font-semibold">
            🎮 START YOUR JOURNEY
          </Link>
        </div>
      </div>

      {/* Disclaimer - matching homepage */}
      <div className="text-center text-xs text-[#53565A] max-w-2xl mt-8">
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

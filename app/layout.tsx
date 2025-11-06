import "./globals.css";
import Link from "next/link";
import AudioToggle from "@/components/AudioToggle";
import { SoundProvider } from "@/contexts/SoundContext";

export const metadata = {
  title: "Ethics-Tech-Policy Decisions Sandbox",
  description: "A web-based simulator for ethical tradeoffs in tech and policy.",
  openGraph: {
    title: "Ethics-Tech-Policy Decisions Sandbox",
    description: "A web-based simulator for ethical tradeoffs in tech and policy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethics-Tech-Policy Decisions Sandbox",
    description: "A web-based simulator for ethical tradeoffs in tech and policy.",
  },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen suspense-bg">
        <SoundProvider>
          <header className="bg-white border-b-2 border-[#8C1515] sticky top-0 z-50 shadow-lg">
            <nav className="mx-auto max-w-6xl flex items-center justify-between p-2 sm:p-4">
              <Link href="/" className="font-semibold text-[#2E2D29] text-sm sm:text-lg hover:text-[#8C1515] transition-all duration-300 flex items-center gap-1 sm:gap-2 group flex-1 min-w-0">
                <span className="text-xl sm:text-2xl stanford-tree flex-shrink-0">🌲</span>
                <span className="group-hover:underline truncate sm:truncate-none">Ethics-Tech-Policy Decisions Sandbox</span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <AudioToggle />
                <Link href="/about" className="text-xs sm:text-sm text-[#2E2D29] hover:text-[#8C1515] transition-all duration-300 font-semibold hover:underline whitespace-nowrap">About</Link>
              </div>
            </nav>
            {/* Collapsible Disclaimer for Mobile */}
            <div className="bg-[#F4F4F4] border-t border-[#8C1515]/20">
              <div className="mx-auto max-w-6xl px-2 sm:px-4 py-1 sm:py-2">
                {/* Mobile: Collapsible, Desktop: Always visible */}
                <details className="sm:open">
                  <summary className="text-xs text-[#53565A] cursor-pointer list-none py-1 touch-manipulation sm:cursor-default">
                    <div className="flex items-start gap-1 sm:flex-row">
                      <span className="font-semibold text-[#8C1515] flex-shrink-0">Disclaimer:</span>
                      <span className="text-[#53565A] flex-1">
                        {/* Mobile: truncated in summary (hidden when open), Desktop: full text */}
                        <span className="sm:hidden line-clamp-2" id="disclaimer-summary-mobile">
                          This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
                        </span>
                        <span className="hidden sm:inline">
                          This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
                        </span>
                      </span>
                      <span className="text-[#8C1515] font-semibold ml-2 flex-shrink-0 sm:hidden" id="disclaimer-expand-hint">(tap to expand)</span>
                    </div>
                  </summary>
                  {/* Mobile: Only shows full text when expanded (replaces summary text) */}
                  <div className="sm:hidden">
                    <p className="text-xs text-[#53565A] leading-relaxed mt-1">
                      <span className="font-semibold text-[#8C1515]">Disclaimer: </span>
                      This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </header>
          <main className="relative z-10 mx-auto max-w-5xl px-4 py-4">{children}</main>
        </SoundProvider>
      </body>
    </html>
  );
}

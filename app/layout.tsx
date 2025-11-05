import "./globals.css";
import Link from "next/link";
import AudioToggle from "@/components/AudioToggle";
import { SoundProvider } from "@/contexts/SoundContext";

export const metadata = {
  title: "Ethics-Tech-Policy Decisions Sandbox",
  description: "A web-based simulator for ethical tradeoffs in tech and policy.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen suspense-bg">
        <SoundProvider>
          <header className="bg-white border-b-2 border-[#8C1515] sticky top-0 z-50 shadow-lg">
            <nav className="mx-auto max-w-6xl flex items-center justify-between p-4">
              <Link href="/" className="font-semibold text-[#2E2D29] text-lg hover:text-[#8C1515] transition-all duration-300 flex items-center gap-2 group">
                <span className="text-2xl stanford-tree">🌲</span>
                <span className="group-hover:underline">Ethics-Tech-Policy Decisions Sandbox</span>
              </Link>
              <div className="flex items-center gap-4">
                <AudioToggle />
                <Link href="/about" className="text-sm text-[#2E2D29] hover:text-[#8C1515] transition-all duration-300 font-semibold hover:underline">About</Link>
              </div>
            </nav>
            <div className="bg-[#F4F4F4] border-t border-[#8C1515]/20">
              <div className="mx-auto max-w-6xl px-4 py-2">
                <p className="text-xs text-[#53565A] text-left">
                  <strong>Disclaimer:</strong> This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
                </p>
              </div>
            </div>
          </header>
          <main className="relative z-10 mx-auto max-w-5xl px-4 py-4">{children}</main>
        </SoundProvider>
      </body>
    </html>
  );
}

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
          </header>
          <main className="relative z-10 mx-auto max-w-5xl px-4 py-4">{children}</main>
        </SoundProvider>
      </body>
    </html>
  );
}

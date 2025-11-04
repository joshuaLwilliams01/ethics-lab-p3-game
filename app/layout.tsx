import "./globals.css";
import Link from "next/link";
import AudioToggle from "@/components/AudioToggle";

export const metadata = {
  title: "Ethics-Tech-Policy Decisions Sandbox",
  description: "A web-based simulator for ethical tradeoffs in tech and policy.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen suspense-bg">
        <header className="bg-white border-b-2 border-[#8C1515]">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <Link href="/" className="font-semibold text-[#2E2D29] text-lg">
              Ethics-Tech-Policy Decisions Sandbox
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-sm text-[#2E2D29] hover:text-[#8C1515] transition">About</Link>
              <AudioToggle />
            </div>
          </nav>
          <div className="mx-auto max-w-5xl px-4 pb-3 text-xs text-[#53565A] border-t border-gray-100 pt-2">
            <strong>Disclaimer:</strong> An independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the McCoy Family Center for Ethics in Society staff.
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}

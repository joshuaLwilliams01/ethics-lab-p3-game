import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Ethics-Tech-Policy Decisions Sandbox",
  description: "A web-based simulator for ethical tradeoffs in tech and policy.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen suspense-bg">
        <header className="bg-white border-b-2 border-[#8C1515] sticky top-0 z-50 shadow-lg">
          <nav className="mx-auto max-w-6xl flex items-center justify-between p-4">
            <Link href="/" className="font-semibold text-[#2E2D29] text-lg hover:text-[#8C1515] transition-all duration-300 flex items-center gap-2 group">
              <span className="text-2xl stanford-tree">🌲</span>
              <span className="group-hover:underline">Ethics-Tech-Policy Decisions Sandbox</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-sm text-[#2E2D29] hover:text-[#8C1515] transition-all duration-300 font-semibold hover:underline">About</Link>
            </div>
          </nav>
          <div className="mx-auto max-w-5xl px-4 pb-3 text-xs text-[#53565A] border-t border-gray-100 pt-2 bg-gradient-to-r from-transparent via-gray-50 to-transparent">
            <strong>Disclaimer:</strong> This is an independent capstone project by Joshua Williams for the Ethics+Tech Public Policy Practitioner Course; not associated with the Stanford McCoy Family Center for Ethics in Society or its staff.
          </div>
        </header>
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

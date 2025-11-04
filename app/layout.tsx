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
        <header className="bg-white border-b-2 border-[#8C1515] sticky top-0 z-50">
          <nav className="mx-auto max-w-6xl flex items-center justify-between p-4">
            <Link href="/" className="font-semibold text-[#2E2D29] text-lg hover:text-[#8C1515] transition">
              Ethics-Tech-Policy Decisions Sandbox
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-sm text-[#2E2D29] hover:text-[#8C1515] transition">About</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

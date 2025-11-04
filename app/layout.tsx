import "./globals.css";
import Link from "next/link";
export const metadata = { title: "Ethics Lab: People · Planet · Parity" };
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b bg-white/70 backdrop-blur sticky top-0">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-3">
            <Link href="/" className="font-semibold">Ethics Lab · P3</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/play">Play</Link>
              <Link href="/about">About</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}


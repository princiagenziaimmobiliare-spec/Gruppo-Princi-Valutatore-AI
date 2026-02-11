import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <header className="border-b bg-white">
          <div className="container-page flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-bold text-brand">Gruppo PRINCI</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/valutazione">Valutazione gratuita</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t bg-white">
          <div className="container-page py-8 text-sm text-slate-600">
            <p>Powered by Gruppo PRINCI</p>
            <p>Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@gruppoprinci.it"} · Tel: {process.env.NEXT_PUBLIC_CONTACT_PHONE || "+39 000 0000000"}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

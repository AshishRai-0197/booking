import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "StayBhutan · Hotel & Homestay Booking",
  description: "Find and book hotels, cottages and homestays across Bhutan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          StayBhutan · Built with Next.js & PostgreSQL by Ashish Rai
        </footer>
      </body>
    </html>
  );
}

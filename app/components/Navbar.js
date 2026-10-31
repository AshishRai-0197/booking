import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-emerald-700">
          🏨 StayBhutan
        </Link>
        <div className="flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-emerald-700">
            Rooms
          </Link>
          <Link href="/bookings" className="hover:text-emerald-700">
            My bookings
          </Link>
        </div>
      </nav>
    </header>
  );
}

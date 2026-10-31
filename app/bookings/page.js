"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice, todayString } from "@/lib/booking";

export default function BookingsPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
      <MyBookings />
    </Suspense>
  );
}

function MyBookings() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadBookings(forEmail = email) {
    if (!forEmail.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(forEmail.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load bookings");
      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fromUrl = searchParams.get("email");
    if (fromUrl) loadBookings(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancelBooking(booking) {
    if (!window.confirm(`Cancel booking #${booking.id} at ${booking.room_name}?`)) return;
    setNotice("");
    setError("");
    const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: booking.guest_email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not cancel booking");
      return;
    }
    setNotice(`Booking #${booking.id} was cancelled.`);
    loadBookings();
  }

  const today = todayString();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">My bookings</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotice("");
          loadBookings();
        }}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row"
      >
        <input
          type="email"
          required
          placeholder="Email you booked with"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input flex-1"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Find bookings
        </button>
      </form>

      {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {notice && <p className="rounded-lg bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
      {loading && <p className="text-slate-500">Loading…</p>}

      {bookings && !loading && bookings.length === 0 && (
        <p className="text-slate-500">
          No bookings found for this email.{" "}
          <Link href="/" className="text-emerald-700 underline">
            Browse rooms
          </Link>
        </p>
      )}

      <ul className="space-y-4">
        {bookings?.map((b) => {
          const cancelled = b.status === "cancelled";
          const canCancel = !cancelled && b.check_in > today;
          return (
            <li
              key={b.id}
              className={`flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center ${
                cancelled ? "opacity-60" : ""
              }`}
            >
              <div className="text-4xl">{b.room_emoji}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{b.room_name}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      cancelled ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {cancelled ? "Cancelled" : "Confirmed"}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  #{b.id} · {b.check_in} → {b.check_out} · {b.guests} guest
                  {b.guests > 1 ? "s" : ""}
                </p>
                <p className="text-sm font-medium">{formatPrice(b.total_price)}</p>
              </div>
              {canCancel && (
                <button
                  onClick={() => cancelBooking(b)}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Cancel
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

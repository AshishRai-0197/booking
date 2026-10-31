"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { countNights, formatPrice, todayString } from "@/lib/booking";

export default function RoomPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading room…</p>}>
      <RoomDetails />
    </Suspense>
  );
}

function RoomDetails() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [room, setRoom] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({
    guest_name: "",
    guest_email: "",
    guests: Number(searchParams.get("guests")) || 1,
    check_in: searchParams.get("check_in") || "",
    check_out: searchParams.get("check_out") || "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  async function loadRoom() {
    try {
      const res = await fetch(`/api/rooms/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load room");
      setRoom(data.room);
      setBookedDates(data.bookedDates);
    } catch (err) {
      setLoadError(err.message);
    }
  }

  useEffect(() => {
    loadRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, room_id: room.id, guests: Number(form.guests) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setMessage(data.error || "Booking failed");
        return;
      }
      setBooking(data.booking);
      loadRoom();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-red-50 p-3 text-red-700">{loadError}</p>
        <Link href="/" className="text-emerald-700 underline">
          ← Back to rooms
        </Link>
      </div>
    );
  }
  if (!room) return <p className="text-slate-500">Loading room…</p>;

  const nights =
    form.check_in && form.check_out ? countNights(form.check_in, form.check_out) : 0;
  const today = todayString();

  if (booking) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">✅</div>
        <h1 className="text-2xl font-bold">Booking confirmed!</h1>
        <p className="text-slate-600">
          Booking #{booking.id} · {room.name}
        </p>
        <div className="rounded-xl bg-slate-50 p-4 text-left text-sm">
          <p>
            <b>Guest:</b> {booking.guest_name} ({booking.guest_email})
          </p>
          <p>
            <b>Dates:</b> {booking.check_in} → {booking.check_out}
          </p>
          <p>
            <b>Guests:</b> {booking.guests}
          </p>
          <p>
            <b>Total:</b> {formatPrice(booking.total_price)}
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href={`/bookings?email=${encodeURIComponent(booking.guest_email)}`}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            My bookings
          </Link>
          <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 font-medium">
            More rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section className="space-y-4 lg:col-span-3">
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← Back to rooms
        </Link>
        <div className="flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-8xl">
          {room.emoji}
        </div>
        <h1 className="text-3xl font-bold">{room.name}</h1>
        <p className="text-slate-500">
          {room.type} · up to {room.capacity} guests
        </p>
        <p className="text-slate-700">{room.description}</p>
        <ul className="flex flex-wrap gap-2">
          {room.amenities.map((item) => (
            <li key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              {item}
            </li>
          ))}
        </ul>
        {bookedDates.length > 0 && (
          <div className="rounded-xl bg-amber-50 p-4 text-sm">
            <p className="mb-1 font-medium text-amber-800">Already booked:</p>
            <ul className="space-y-0.5 text-amber-900">
              {bookedDates.map((b) => (
                <li key={`${b.check_in}-${b.check_out}`}>
                  {b.check_in} → {b.check_out}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
      >
        <p>
          <span className="text-2xl font-bold">{formatPrice(room.price_per_night)}</span>
          <span className="text-slate-500"> / night</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in">
            <input
              type="date"
              required
              min={today}
              value={form.check_in}
              onChange={update("check_in")}
              className="input"
            />
          </Field>
          <Field label="Check-out">
            <input
              type="date"
              required
              min={form.check_in || today}
              value={form.check_out}
              onChange={update("check_out")}
              className="input"
            />
          </Field>
        </div>
        {errors.dates && <p className="text-sm text-red-600">{errors.dates}</p>}

        <Field label="Full name" error={errors.guest_name}>
          <input required value={form.guest_name} onChange={update("guest_name")} className="input" />
        </Field>
        <Field label="Email" error={errors.guest_email}>
          <input
            type="email"
            required
            value={form.guest_email}
            onChange={update("guest_email")}
            className="input"
          />
        </Field>
        <Field label="Guests" error={errors.guests}>
          <input
            type="number"
            required
            min={1}
            max={room.capacity}
            value={form.guests}
            onChange={update("guests")}
            className="input"
          />
        </Field>

        {nights > 0 && (
          <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm">
            <span>
              {formatPrice(room.price_per_night)} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <b>{formatPrice(room.price_per_night * nights)}</b>
          </div>
        )}

        {message && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? "Booking…" : "Book now"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-red-600">{error}</span>}
    </label>
  );
}

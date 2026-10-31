"use client";

import { useEffect, useState } from "react";
import RoomCard from "./components/RoomCard";
import { todayString } from "@/lib/booking";

export default function HomePage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRooms(params = "") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/rooms${params ? `?${params}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load rooms");
      setRooms(data.rooms);
      setQuery(params);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams({ guests: String(guests) });
    if (checkIn && checkOut) {
      params.set("check_in", checkIn);
      params.set("check_out", checkOut);
    }
    loadRooms(params.toString());
  }

  const today = todayString();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-sky-700 px-6 py-10 text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Find your stay in Bhutan</h1>
        <p className="mt-2 text-emerald-50">
          Hotels, cottages and homestays from Thimphu to Bumthang.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-6 grid gap-3 rounded-2xl bg-white p-4 text-slate-800 sm:grid-cols-4"
        >
          <label className="text-sm">
            <span className="mb-1 block font-medium">Check-in</span>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Check-out</span>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Guests</span>
            <input
              type="number"
              min={1}
              max={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="self-end rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            Search
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {query.includes("check_in") ? "Rooms for your dates" : "All rooms"}
        </h2>
        {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading rooms…</p>
        ) : rooms.length === 0 ? (
          <p className="text-slate-500">No rooms match your search.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} query={query} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

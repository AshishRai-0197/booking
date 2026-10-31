import Link from "next/link";
import { formatPrice } from "@/lib/booking";

export default function RoomCard({ room, query }) {
  const unavailable = room.available === false;
  const href = `/rooms/${room.id}${query ? `?${query}` : ""}`;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md ${
        unavailable ? "opacity-60" : ""
      }`}
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-100 to-sky-100 text-6xl">
        {room.emoji}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{room.name}</h3>
          {room.available !== undefined && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                unavailable ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {unavailable ? "Booked" : "Available"}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">
          {room.type} · up to {room.capacity} guests
        </p>
        <p className="line-clamp-2 text-sm text-slate-600">{room.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p>
            <span className="text-lg font-bold">{formatPrice(room.price_per_night)}</span>
            <span className="text-sm text-slate-500"> / night</span>
          </p>
          <Link
            href={href}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {unavailable ? "View" : "Book"}
          </Link>
        </div>
      </div>
    </article>
  );
}

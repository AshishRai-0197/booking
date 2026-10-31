import db from "@/lib/db";
import { validateDates } from "@/lib/booking";

// GET /api/rooms?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD&guests=2
// Lists all rooms. With dates, each room also gets `available: true/false`.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const guests = Number(searchParams.get("guests")) || 1;

  try {
    let query = db("rooms").select("*").orderBy("price_per_night");
    if (guests > 1) query = query.where("capacity", ">=", guests);
    const rooms = await query;

    if (!checkIn || !checkOut) {
      return Response.json({ rooms });
    }

    const dateError = validateDates(checkIn, checkOut);
    if (dateError) {
      return Response.json({ error: dateError }, { status: 400 });
    }

    const bookedRoomIds = await db("bookings")
      .where("status", "confirmed")
      .andWhere("check_in", "<", checkOut)
      .andWhere("check_out", ">", checkIn)
      .distinct()
      .pluck("room_id");

    const booked = new Set(bookedRoomIds);
    return Response.json({
      rooms: rooms.map((room) => ({ ...room, available: !booked.has(room.id) })),
    });
  } catch (error) {
    console.error("GET /api/rooms failed:", error);
    return Response.json({ error: "Could not load rooms" }, { status: 500 });
  }
}

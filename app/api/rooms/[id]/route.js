import db from "@/lib/db";
import { todayString } from "@/lib/booking";

// GET /api/rooms/:id
// Returns the room and its upcoming booked date ranges (no guest details).
export async function GET(request, { params }) {
  const { id } = await params;
  const roomId = Number(id);
  if (!Number.isInteger(roomId)) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  try {
    const room = await db("rooms").where({ id: roomId }).first();
    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    const bookedDates = await db("bookings")
      .select("check_in", "check_out")
      .where({ room_id: roomId, status: "confirmed" })
      .andWhere("check_out", ">", todayString())
      .orderBy("check_in");

    return Response.json({ room, bookedDates });
  } catch (error) {
    console.error("GET /api/rooms/:id failed:", error);
    return Response.json({ error: "Could not load room" }, { status: 500 });
  }
}

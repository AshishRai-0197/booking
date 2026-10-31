import db from "@/lib/db";
import { totalPrice, validateBooking } from "@/lib/booking";

// POST /api/bookings
// Body: { room_id, guest_name, guest_email, guests, check_in, check_out }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { isValid, errors, data } = validateBooking(body);
  if (!isValid) {
    return Response.json({ error: "Please fix the form", errors }, { status: 400 });
  }

  try {
    const booking = await db.transaction(async (trx) => {
      // Lock the room row so two people can't book the same dates at once.
      const room = await trx("rooms").where({ id: data.room_id }).forUpdate().first();
      if (!room) throw new BookingError("Room not found", 404);

      if (data.guests > room.capacity) {
        throw new BookingError(`This room fits up to ${room.capacity} guests.`, 400);
      }

      const clash = await trx("bookings")
        .where({ room_id: room.id, status: "confirmed" })
        .andWhere("check_in", "<", data.check_out)
        .andWhere("check_out", ">", data.check_in)
        .first();
      if (clash) {
        throw new BookingError("Sorry, this room is already booked for those dates.", 409);
      }

      const [created] = await trx("bookings")
        .insert({
          ...data,
          total_price: totalPrice(room.price_per_night, data.check_in, data.check_out),
        })
        .returning("*");
      return created;
    });

    return Response.json({ message: "Booking confirmed", booking }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/bookings failed:", error);
    return Response.json({ error: "Could not create booking" }, { status: 500 });
  }
}

// GET /api/bookings?email=you@example.com
// Lists the bookings made with that email, newest stay first.
export async function GET(request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const bookings = await db("bookings as b")
      .join("rooms as r", "r.id", "b.room_id")
      .select("b.*", "r.name as room_name", "r.type as room_type", "r.emoji as room_emoji")
      .where("b.guest_email", email)
      .orderBy("b.check_in", "desc");

    return Response.json({ bookings });
  } catch (error) {
    console.error("GET /api/bookings failed:", error);
    return Response.json({ error: "Could not load bookings" }, { status: 500 });
  }
}

class BookingError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

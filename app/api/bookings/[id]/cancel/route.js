import db from "@/lib/db";
import { todayString } from "@/lib/booking";

// PATCH /api/bookings/:id/cancel
// Body: { email } - must match the email used to book.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const bookingId = Number(id);
  let email = "";
  try {
    email = String((await request.json()).email ?? "").trim().toLowerCase();
  } catch {
    // handled below
  }
  if (!Number.isInteger(bookingId) || !email) {
    return Response.json({ error: "Booking id and email are required" }, { status: 400 });
  }

  try {
    const booking = await db("bookings").where({ id: bookingId, guest_email: email }).first();
    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.status === "cancelled") {
      return Response.json({ error: "This booking is already cancelled" }, { status: 409 });
    }
    if (booking.check_in <= todayString()) {
      return Response.json(
        { error: "Bookings can only be cancelled before the check-in day" },
        { status: 400 },
      );
    }

    const [updated] = await db("bookings")
      .where({ id: bookingId })
      .update({ status: "cancelled", updated_at: db.fn.now() })
      .returning("*");

    return Response.json({ message: "Booking cancelled", booking: updated });
  } catch (error) {
    console.error("PATCH /api/bookings/:id/cancel failed:", error);
    return Response.json({ error: "Could not cancel booking" }, { status: 500 });
  }
}

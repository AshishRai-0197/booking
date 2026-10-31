// Small, pure helpers for booking rules. Tested in lib/booking.test.mjs.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_NIGHTS = 30;

export function isValidDate(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function todayString(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function countNights(checkIn, checkOut) {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  return Math.round((end - start) / DAY_MS);
}

export function totalPrice(pricePerNight, checkIn, checkOut) {
  return pricePerNight * countNights(checkIn, checkOut);
}

// Two stays overlap when one starts before the other ends.
// Check-out day is free, so a new guest can check in that same day.
export function datesOverlap(aIn, aOut, bIn, bOut) {
  return aIn < bOut && bIn < aOut;
}

export function validateDates(checkIn, checkOut, today = todayString()) {
  if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
    return "Please choose valid check-in and check-out dates.";
  }
  if (checkIn < today) return "Check-in date cannot be in the past.";
  const nights = countNights(checkIn, checkOut);
  if (nights < 1) return "Check-out must be at least 1 day after check-in.";
  if (nights > MAX_NIGHTS) return `You can book up to ${MAX_NIGHTS} nights.`;
  return null;
}

export function validateBooking(input, today = todayString()) {
  const errors = {};
  const name = String(input.guest_name ?? "").trim();
  const email = String(input.guest_email ?? "").trim().toLowerCase();
  const guests = Number(input.guests);

  if (name.length < 2) errors.guest_name = "Please enter your full name.";
  if (name.length > 100) errors.guest_name = "Name is too long.";
  if (!EMAIL_RE.test(email)) errors.guest_email = "Please enter a valid email.";
  if (!Number.isInteger(guests) || guests < 1) {
    errors.guests = "At least 1 guest is required.";
  }
  const dateError = validateDates(input.check_in, input.check_out, today);
  if (dateError) errors.dates = dateError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    data: {
      room_id: Number(input.room_id),
      guest_name: name,
      guest_email: email,
      guests,
      check_in: input.check_in,
      check_out: input.check_out,
    },
  };
}

export function formatPrice(nu) {
  return `Nu. ${Number(nu).toLocaleString("en-IN")}`;
}

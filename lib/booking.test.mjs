import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countNights,
  datesOverlap,
  isValidDate,
  totalPrice,
  validateBooking,
  validateDates,
} from "./booking.js";

const TODAY = "2026-11-01";

test("isValidDate accepts real dates only", () => {
  assert.equal(isValidDate("2026-11-05"), true);
  assert.equal(isValidDate("2026-02-30"), false);
  assert.equal(isValidDate("05-11-2026"), false);
  assert.equal(isValidDate(undefined), false);
});

test("countNights and totalPrice", () => {
  assert.equal(countNights("2026-11-05", "2026-11-08"), 3);
  assert.equal(totalPrice(4500, "2026-11-05", "2026-11-08"), 13500);
  assert.equal(countNights("2026-12-30", "2027-01-02"), 3);
});

test("datesOverlap: back-to-back stays do not overlap", () => {
  assert.equal(datesOverlap("2026-11-05", "2026-11-08", "2026-11-08", "2026-11-10"), false);
  assert.equal(datesOverlap("2026-11-05", "2026-11-08", "2026-11-07", "2026-11-09"), true);
  assert.equal(datesOverlap("2026-11-05", "2026-11-08", "2026-11-01", "2026-11-20"), true);
  assert.equal(datesOverlap("2026-11-05", "2026-11-08", "2026-11-01", "2026-11-05"), false);
});

test("validateDates rules", () => {
  assert.equal(validateDates("2026-11-05", "2026-11-06", TODAY), null);
  assert.match(validateDates("2026-10-30", "2026-11-02", TODAY), /past/);
  assert.match(validateDates("2026-11-05", "2026-11-05", TODAY), /at least 1 day/);
  assert.match(validateDates("2026-11-05", "2026-12-25", TODAY), /up to 30/);
});

test("validateBooking collects all errors", () => {
  const bad = validateBooking(
    { guest_name: "A", guest_email: "nope", guests: 0, check_in: "x", check_out: "y" },
    TODAY,
  );
  assert.equal(bad.isValid, false);
  assert.deepEqual(Object.keys(bad.errors).sort(), ["dates", "guest_email", "guest_name", "guests"]);

  const good = validateBooking(
    {
      room_id: "2",
      guest_name: "  Ashish Rai ",
      guest_email: "Ashish@Example.com",
      guests: "2",
      check_in: "2026-11-05",
      check_out: "2026-11-07",
    },
    TODAY,
  );
  assert.equal(good.isValid, true);
  assert.equal(good.data.guest_name, "Ashish Rai");
  assert.equal(good.data.guest_email, "ashish@example.com");
  assert.equal(good.data.room_id, 2);
});

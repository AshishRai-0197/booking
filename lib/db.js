import knex from "knex";
import pg from "pg";
import knexConfig from "@/knexfile";

// Return DATE columns as plain "YYYY-MM-DD" strings (no time zone shifts).
pg.types.setTypeParser(1082, (value) => value);

// Reuse one connection pool while Next.js hot-reloads in development.
const globalForDb = globalThis;
const db = globalForDb.__bookingDb ?? knex(knexConfig.development);
if (process.env.NODE_ENV !== "production") globalForDb.__bookingDb = db;

export default db;

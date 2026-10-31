# 🏨 StayBhutan: Hotel & Homestay Booking

A full-stack booking app built with **Next.js** and **PostgreSQL** in **JavaScript**.
Guests can search rooms by date, see live availability and price, book a stay, and view or cancel their bookings.

## ✨ Features

- 🔎 **Search by dates & guests**: every room shows *Available* or *Booked*
- 🛏️ **Room details**: description, amenities and already-booked dates
- 💰 **Live price**: price × nights is calculated as you pick dates
- ✅ **Safe booking**: no double bookings, even if two people click at the same time (row lock in a database transaction)
- 📋 **My bookings**: find your bookings by email
- ❌ **Cancel**: cancel before the check-in day
- 🧪 **Unit tests** for the booking rules (dates, overlap, price, validation)

## 🛠 Built with

| Part | Tech |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| Backend | Next.js API routes (REST) |
| Database | PostgreSQL + Knex.js (migrations & seeds) |
| Tests | Node.js built-in test runner |

## 🚀 Run it locally

**1. Clone and install**

```bash
git clone https://github.com/AshishRai-0197/booking.git
cd booking
npm install
```

**2. Create a database and a `.env` file**

```bash
createdb booking
cp .env.example .env   # then fill in your PostgreSQL user and password
```

**3. Create the tables, add sample rooms, and start**

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Run the tests:** `npm test`

## 🔌 API

| Method | Route | What it does |
| --- | --- | --- |
| GET | `/api/rooms?check_in=&check_out=&guests=` | List rooms (with availability when dates are given) |
| GET | `/api/rooms/:id` | One room + its booked dates |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings?email=` | Bookings for an email |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking (body: `{ "email" }`) |

## 🗄️ Database

- **rooms**: name, type, description, price per night (Nu.), capacity, amenities
- **bookings**: room, guest name & email, check-in, check-out, guests, total price, status

## 📁 Project structure

```
app/
  page.js                 # Home: search + room list
  rooms/[id]/page.js      # Room details + booking form
  bookings/page.js        # My bookings
  api/                    # REST API routes
  components/             # Navbar, RoomCard
lib/
  booking.js              # Booking rules (dates, price, validation)
  booking.test.mjs        # Unit tests
  db.js                   # Database connection
migrations/  seeds/       # Tables and sample rooms
```

## 🗺️ Ideas for next steps

- User accounts with login (right now bookings are found by email)
- Online payment
- Email confirmation after booking

## 👤 Author

**Ashish Rai**: [LinkedIn](https://www.linkedin.com/in/ashish-rai-776022383/) · [GitHub](https://github.com/AshishRai-0197)

exports.seed = async function (knex) {
  await knex("bookings").del();
  await knex("rooms").del();

  await knex("rooms").insert([
    {
      name: "Paro Valley View",
      type: "Deluxe Room",
      description:
        "A bright room with a big window looking over the Paro valley and rice fields.",
      price_per_night: 4500,
      capacity: 2,
      emoji: "🏔️",
      amenities: ["Valley view", "Free Wi-Fi", "Breakfast", "Hot shower"],
    },
    {
      name: "Thimphu City Suite",
      type: "Suite",
      description:
        "A spacious suite in the heart of the capital, close to cafes and the weekend market.",
      price_per_night: 7800,
      capacity: 3,
      emoji: "🏙️",
      amenities: ["Living area", "Free Wi-Fi", "Breakfast", "Work desk"],
    },
    {
      name: "Punakha Riverside Cottage",
      type: "Cottage",
      description:
        "A quiet wooden cottage by the river, a short walk from Punakha Dzong.",
      price_per_night: 6200,
      capacity: 4,
      emoji: "🌊",
      amenities: ["River view", "Garden", "Breakfast", "Family friendly"],
    },
    {
      name: "Bumthang Farmhouse",
      type: "Homestay",
      description:
        "Stay with a local family, enjoy home-cooked meals and a traditional hot stone bath.",
      price_per_night: 3200,
      capacity: 4,
      emoji: "🏡",
      amenities: ["Home meals", "Hot stone bath", "Farm tour"],
    },
    {
      name: "Haa Pine Cabin",
      type: "Cabin",
      description:
        "A cosy cabin among pine trees with a wood stove, perfect for a calm weekend.",
      price_per_night: 3800,
      capacity: 2,
      emoji: "🌲",
      amenities: ["Wood stove", "Forest view", "Hiking trails"],
    },
    {
      name: "Phobjikha Family Room",
      type: "Family Room",
      description:
        "A large room for families near the valley where black-necked cranes visit in winter.",
      price_per_night: 5600,
      capacity: 5,
      emoji: "🦢",
      amenities: ["2 beds", "Valley view", "Breakfast", "Heater"],
    },
  ]);
};

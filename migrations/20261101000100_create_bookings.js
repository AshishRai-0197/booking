exports.up = function (knex) {
  return knex.schema.createTable("bookings", (table) => {
    table.increments("id");
    table
      .integer("room_id")
      .notNullable()
      .references("id")
      .inTable("rooms")
      .onDelete("CASCADE");
    table.string("guest_name", 100).notNullable();
    table.string("guest_email", 255).notNullable().index();
    table.date("check_in").notNullable();
    table.date("check_out").notNullable();
    table.integer("guests").notNullable();
    table.integer("total_price").notNullable();
    table.string("status", 20).notNullable().defaultTo("confirmed");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bookings");
};

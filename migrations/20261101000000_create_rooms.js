exports.up = function (knex) {
  return knex.schema.createTable("rooms", (table) => {
    table.increments("id");
    table.string("name", 100).notNullable();
    table.string("type", 50).notNullable();
    table.text("description").notNullable();
    table.integer("price_per_night").notNullable(); // in Ngultrum (Nu.)
    table.integer("capacity").notNullable();
    table.string("emoji", 10).notNullable().defaultTo("🏨");
    table.specificType("amenities", "text[]").notNullable().defaultTo("{}");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("rooms");
};

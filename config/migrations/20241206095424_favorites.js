/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("favorites", function (table) {
    table.increments("id").primary(); // Primary key
    table.integer("user_id").unsigned().notNullable(); // User who marked the book as favorite
    table.integer("book_id").unsigned().notNullable(); // Book that is marked as favorite
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Update timestamp
    table.timestamp("deleted_at").nullable(); // Soft delete timestamp

    // Foreign key constraints
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Delete favorite if the user is deleted

    table
      .foreign("book_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE"); // Delete favorite if the book is deleted
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("favorites");
}

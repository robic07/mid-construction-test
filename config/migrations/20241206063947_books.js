/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("books", function (table) {
    table.increments("id").primary(); // Primary key
    table.string("title").notNullable(); // Book title
    table.text("author").nullable(); // Author information, can be nullable
    table.text("description").nullable(); // Book description, can be nullable
    table.integer("user_id").unsigned().notNullable(); // User who created the book
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Creation timestamp
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // Update timestamp
    table.timestamp("deleted_at").nullable(); // Soft delete timestamp

    // Foreign key constraint to reference the users table
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Delete books if the user is deleted
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("books");
}

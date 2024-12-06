// knexfile.js
import dotenv from "dotenv";

dotenv.config();
export default {
  development: {
    client: "mysql",
    connection: {
      host: process.env.MYSQL_DB_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    migrations: {
      directory: "./config/migrations",
      stub: "./config/migrationTemplate.js", // Path to the custom template
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

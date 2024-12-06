import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log(`Connected to the database as ID: ${connection.threadId}`);
  });
};

export { connectDB, connection };

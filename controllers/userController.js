// userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { connection } from "../config/db.js"; // Adjust the path if necessary
import _ from "lodash";

// Function to Login
export const userLogin = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];

      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Create a JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
      });
    }
  );
});
// Hashing rounds for bcrypt
const saltRounds = 10;

// Function to create a new user
export const createUser = expressAsyncHandler(async (req, res) => {
  const { username, password, fullname } = req.body;
  // Check if the username already exists
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database
      connection.query(
        "INSERT INTO users (username, password, fullname) VALUES (?, ?, ?)",
        [username, hashedPassword, fullname],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Failed to create user", error: err });
          }

          res.status(201).json({ message: "User created successfully" });
        }
      );
    }
  );
});

// Function to list all users
export const listUsers = expressAsyncHandler(async (req, res) => {
  connection.query(
    "SELECT id, username, fullname FROM users",
    (err, results) => {
      if (err) {
        // Handle any database errors
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Return the list of users
      res
        .status(200)
        .json({ message: "Users retrieved successfully", users: results });
    }
  );
});
// Function to get specific user information base on the user that is logged in
export const getUserById = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  connection.query(
    "SELECT id, username, fullname FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        // Handle any database errors
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        // No user found with the given id
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user details
      res
        .status(200)
        .json({ message: "User retrieved successfully", user: results[0] });
    }
  );
});

// Function to udpate user information
export const updateUser = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, fullname, password } = req.body;

  // Create an array to hold the update statements and values
  const updates = [];
  const values = [];

  if (username) {
    updates.push("username = ?");
    values.push(username);
  }

  if (fullname) {
    updates.push("fullname = ?");
    values.push(fullname);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push("password = ?");
    values.push(hashedPassword);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No updates provided" });
  }

  values.push(userId);

  // Build the query dynamically based on provided fields
  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  });
});

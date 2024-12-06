import expressAsyncHandler from "express-async-handler";
import { connection } from "../config/db.js"; // Adjust the path if necessary

// Function to Create a Book
export const createBook = expressAsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; // Get user ID from authMiddleware
  const author = req.user.username; // Get user ID from authMiddleware

  // Check if required fields are provided
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Insert the new book into the database
  connection.query(
    "INSERT INTO books (title, author, description, user_id) VALUES (?, ?, ?, ?)",
    [title, author, description, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({ message: "Book created successfully" });
    }
  );
});
// Function to Get all Books
export const getAllBooks = expressAsyncHandler(async (req, res) => {
  // Query the database to get all books where deleted_at is null
  connection.query(
    "SELECT id, title, author, description, user_id, created_at, updated_at FROM books WHERE deleted_at IS NULL",
    (err, results) => {
      if (err) {
        // Handle any database errors
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Return the list of books
      res
        .status(200)
        .json({ message: "Books retrieved successfully", books: results });
    }
  );
});

// Function to Get Specific Book Base on ID
export const getOneBook = expressAsyncHandler(async (req, res) => {
  const bookId = req.params.id;

  // Query the database to get the book by id
  connection.query(
    "SELECT id, title, author, description, user_id, created_at, updated_at, deleted_at FROM books WHERE id = ?",
    [bookId],
    (err, results) => {
      if (err) {
        // Handle any database errors
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0 || results[0].deleted_at !== null) {
        // No book found with the given id or book is marked as deleted
        return res.status(404).json({ message: "Book not found" });
      }

      // Return the book details
      res
        .status(200)
        .json({ message: "Book retrieved successfully", book: results[0] });
    }
  );
});
// Function to Update a selected book
export const updateBook = expressAsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const { title, description } = req.body;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the book exists and belongs to the user
  connection.query(
    "SELECT * FROM books WHERE id = ? AND user_id = ?",
    [bookId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Create an array to hold the update statements and values
      const updates = ["updated_at = NOW()"]; // Ensure updated_at is always updated
      const values = [];

      if (title) {
        updates.push("title = ?");
        values.push(title);
      }

      if (description) {
        updates.push("description = ?");
        values.push(description);
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: "No updates provided" });
      }

      values.push(bookId);

      // Build the query dynamically based on provided fields
      const query = `UPDATE books SET ${updates.join(", ")} WHERE id = ?`;

      connection.query(query, values, (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully" });
      });
    }
  );
});

// Function to soft delete or archive a book
export const softDeleteBook = expressAsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the book exists and belongs to the user
  connection.query(
    "SELECT * FROM books WHERE id = ? AND user_id = ?",
    [bookId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Update the deleted_at and updated_at fields with the current datetime
      const query =
        "UPDATE books SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?";

      connection.query(query, [bookId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
      });
    }
  );
});

// Function to restore a soft deleted/archive book
export const restoreBook = expressAsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the book exists and belongs to the user
  connection.query(
    "SELECT * FROM books WHERE id = ? AND user_id = ?",
    [bookId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0 || results[0].deleted_at === null) {
        return res
          .status(404)
          .json({ message: "Book not found or not archived" });
      }

      // Update the deleted_at field to NULL and updated_at to current time
      const query =
        "UPDATE books SET deleted_at = NULL, updated_at = NOW() WHERE id = ?";

      connection.query(query, [bookId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book restored successfully" });
      });
    }
  );
});

// Function to permanently delete a book
export const deleteBook = expressAsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the book exists and belongs to the user
  connection.query(
    "SELECT * FROM books WHERE id = ? AND user_id = ?",
    [bookId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Permanently delete the book from the database
      const query = "DELETE FROM books WHERE id = ?";

      connection.query(query, [bookId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Book not found" });
        }

        res
          .status(200)
          .json({ message: "Book permanently deleted successfully" });
      });
    }
  );
});

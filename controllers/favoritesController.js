import expressAsyncHandler from "express-async-handler";
import { connection } from "../config/db.js"; // Adjust the path if necessary

// Function to add a book to favorites
export const addFavorite = expressAsyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the book exists and is not deleted
  connection.query(
    "SELECT * FROM books WHERE id = ? AND deleted_at IS NULL",
    [bookId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Book not found or is deleted" });
      }

      // Check if the book is already in the user's favorites
      connection.query(
        "SELECT * FROM favorites WHERE user_id = ? AND book_id = ?",
        [userId, bookId],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          if (results.length > 0) {
            return res
              .status(409)
              .json({ message: "Book is already in favorites" });
          }

          // Insert the favorite into the favorites table
          const query =
            "INSERT INTO favorites (user_id, book_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";

          connection.query(query, [userId, bookId], (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }

            res
              .status(201)
              .json({ message: "Book added to favorites successfully" });
          });
        }
      );
    }
  );
});

// Function to Get All Favorite Books
export const getAllFavorites = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id; // Get user ID from authMiddleware

  // Query the database to get all favorites where deleted_at is null and include book information
  const query = `
      SELECT 
        f.id as favorite_id,
        f.created_at as favorite_created_at,
        f.updated_at as favorite_updated_at,
        b.id as book_id,
        b.title,
        b.author,
        b.description,
        b.user_id as book_user_id,
        b.created_at as book_created_at,
        b.updated_at as book_updated_at
      FROM favorites f
      JOIN books b ON f.book_id = b.id
      WHERE f.user_id = ? AND f.deleted_at IS NULL AND b.deleted_at IS NULL
    `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({
      message: "Favorites retrieved successfully",
      favorites: results,
    });
  });
});

// Function to Archive a Favorites
export const archiveFavorites = expressAsyncHandler(async (req, res) => {
  const favoriteId = req.params.id;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the favorite exists and belongs to the user
  connection.query(
    "SELECT * FROM favorites WHERE id = ? AND user_id = ?",
    [favoriteId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      // Update the deleted_at field with the current datetime and updated_at to current time
      const query =
        "UPDATE favorites SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?";

      connection.query(query, [favoriteId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ message: "Favorite archived successfully" });
      });
    }
  );
});
// Function to archive a specific favorite
export const restoreFavorites = expressAsyncHandler(async (req, res) => {
  const favoriteId = req.params.id;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the favorite exists and belongs to the user
  connection.query(
    "SELECT * FROM favorites WHERE id = ? AND user_id = ?",
    [favoriteId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0 || results[0].deleted_at === null) {
        return res
          .status(404)
          .json({ message: "Favorite not found or not archived" });
      }

      // Update the deleted_at field to NULL and updated_at to current time
      const query =
        "UPDATE favorites SET deleted_at = NULL, updated_at = NOW() WHERE id = ?";

      connection.query(query, [favoriteId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ message: "Favorite restored successfully" });
      });
    }
  );
});
// Function to permanently delete a favorite
export const deleteFavorites = expressAsyncHandler(async (req, res) => {
  const favoriteId = req.params.id;
  const userId = req.user.id; // Get user ID from authMiddleware

  // First, check if the favorite exists and belongs to the user
  connection.query(
    "SELECT * FROM favorites WHERE id = ? AND user_id = ?",
    [favoriteId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      // Permanently delete the favorite from the database
      const query = "DELETE FROM favorites WHERE id = ?";

      connection.query(query, [favoriteId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Favorite not found" });
        }

        res
          .status(200)
          .json({ message: "Favorite permanently deleted successfully" });
      });
    }
  );
});

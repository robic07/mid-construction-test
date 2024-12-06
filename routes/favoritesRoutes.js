import express from "express";
import {
  addFavorite,
  getAllFavorites,
  archiveFavorites,
  restoreFavorites,
  deleteFavorites,
} from "#src/controllers/favoritesController";
import authMiddleware from "#src/middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getAllFavorites)
  .post(authMiddleware, addFavorite);

router.route("/archive/:id").delete(authMiddleware, archiveFavorites);
router.route("/restore/:id").patch(authMiddleware, restoreFavorites);

router.route("/delete/:id").delete(authMiddleware, deleteFavorites);

export default router;

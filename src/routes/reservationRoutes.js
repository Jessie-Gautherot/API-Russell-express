import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { 
  createReservationController,
  getReservationByIdController,
  getReservationsByCatwayController,
  deleteReservationController
} from "../controllers/reservationController.js";

const router = express.Router();

//Liste toutes les réservations d’un catway
router.get("/catways/:catwayId/reservations", authMiddleware, getReservationsByCatwayController);
//Récupère une réservation spécifique d’un catway
router.get("/catways/:catwayId/reservations/:idReservation", authMiddleware, getReservationByIdController);
//Ajout réservation pour un catway
router.post("/catways/:catwayId/reservations", authMiddleware, createReservationController);
//Suppression réservation d’un catway
router.delete("/catways/:catwayId/reservations/:idReservation", authMiddleware, deleteReservationController);

export default router;


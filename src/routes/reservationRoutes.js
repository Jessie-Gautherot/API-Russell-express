import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { 
  createReservationController,
  getReservationByIdController,
  getReservationsByCatwayController,
  deleteReservationController
} from "../controllers/reservationController.js";

const router = express.Router();


//Routes sous-ressource catway
router.get("/catways/:catwayId/reservations", authMiddleware, getReservationsByCatwayController);
router.get("/catways/:catwayId/reservations/:idReservation", authMiddleware, getReservationByIdController);
router.post("/catways/:catwayId/reservations", authMiddleware, createReservationController);
router.delete("/catways/:catwayId/reservations/:idReservation", authMiddleware, deleteReservationController);

export default router;


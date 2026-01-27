import express from "express";
import {createCatwayController, getAllCatwaysController, getCatwayByIdController, updateCatwayController, patchCatwayStateController, deleteCatwayController} from "../controllers/catwayController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Liste des catways (protégé)
router.get("/catways", authMiddleware, getAllCatwaysController);

// Catway par ID (protégé)
router.get("/catways/:id", authMiddleware, getCatwayByIdController);

// Créer nouveau catway (protégé)
router.post("/catways", authMiddleware, createCatwayController);

// Mise à jour total du catway (protégé)
router.put("/catways/:id", authMiddleware, updateCatwayController);

// Mise à jour de l'état d'un catway (protégé)
router.patch("/catways/:id", authMiddleware, patchCatwayStateController);

// Supprimer un catway (protégé)
router.delete("/catways/:id", authMiddleware, deleteCatwayController);

export default router;

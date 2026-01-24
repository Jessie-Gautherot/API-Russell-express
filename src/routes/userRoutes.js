import express from "express";
import {createUserController, getUserController, updateUserController,deleteUserController} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Créer un utilisateur
router.post("/users", createUserController);

// Récupérer un utilisateur par ID (protégé)
router.get("/users/:id", authMiddleware, getUserController);

// Mettre à jour un utilisateur (protégé)
router.put("/users/:id", authMiddleware, updateUserController);

// Supprimer un utilisateur (protégé)
router.delete("/users/:id", authMiddleware, deleteUserController);

export default router;

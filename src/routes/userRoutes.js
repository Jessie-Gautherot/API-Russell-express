import express from "express";
import {createUserController, loginUserController, getUserController, getAllUsersController, updateUserController,deleteUserController} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route publique pour se connecter
router.post("/users/login", loginUserController);

// Créer un utilisateur (protégé)
router.post("/users", authMiddleware, createUserController);

// Route pour récupérer tous les utilisateurs (protégé)
router.get("/users", authMiddleware, getAllUsersController);

// Récupérer un utilisateur par ID 
router.get("/users/:id", getUserController);

// Mettre à jour un utilisateur (protégé)
router.put("/users/:id", authMiddleware, updateUserController);

// Supprimer un utilisateur (protégé)
router.delete("/users/:id", authMiddleware, deleteUserController);

export default router;

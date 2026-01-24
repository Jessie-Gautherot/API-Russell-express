import express from "express";
import { loginUserController } from "../controllers/userController.js";

const router = express.Router();

// Connexion utilisateur
router.post("/login", loginUserController);

export default router;

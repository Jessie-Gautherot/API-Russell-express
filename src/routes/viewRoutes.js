//Routes pour les views EJS
import express from "express";
import { getDashboard, getCatwayDetails, getCatwaysListe } from "../controllers/dashboardViewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Accueil / login
router.get("/", (req, res) => {
  res.render("home");
});

// Dashboard (protégé)
router.get("/dashboard", authMiddleware, getDashboard);

//Route pour afficher la liste des catways (protégée)
router.get("/catways/list", authMiddleware, getCatwaysListe);

// Route pour afficher les détails d'un catway (protégée)
router.get("/catway/details/:id", authMiddleware, getCatwayDetails);


// Documentation page publique
router.get("/documentation", (req, res) => {
  res.render("documentation");
});

export default router;

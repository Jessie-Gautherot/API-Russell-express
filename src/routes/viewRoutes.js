//Routes pour les views EJS
import express from "express";
import { getDocumentationApi, getDashboard, getCatwayDetails, getCatwaysListe, getReservationsListe } from "../controllers/dashboardViewController.js";
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

// Route pour afficher la liste complète des réservations (protégée)
router.get("/reservations/list", authMiddleware, getReservationsListe);


// Documentation page Api
router.get("/documentationApi", getDocumentationApi);

export default router;

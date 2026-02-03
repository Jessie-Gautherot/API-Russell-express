//Routes pour les views EJS
import express from "express";


const router = express.Router();

// Accueil
router.get("/", (req, res) => {
  res.render("home");
});

// Dashboard - page protégée
router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Documentation - page publique
router.get("/documentation", (req, res) => {
  res.render("documentation");
});

export default router;

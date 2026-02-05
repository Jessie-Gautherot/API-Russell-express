//Routes pour les views EJS
import express from "express";
import User from "../models/userModel.js"; 

const router = express.Router();

// Accueil / login
router.get("/", (req, res) => {
  res.render("home");
});

// Dashboard – page à protéger
router.get("/dashboard", async (req, res, next) => {
  try {
    // récupérer tous les users
    const users = await User.find(); 
    // passer les users à EJS
    res.render("dashboard", { users }); 
  } catch (err) {
    next(err);
  }
});

// Documentation - page publique
router.get("/documentation", (req, res) => {
  res.render("documentation");
});

export default router;

import { getAllUsers } from "../services/userService.js";
import { getAllCatways } from "../services/catwayService.js";
import { getAllReservations} from "../services/reservationService.js";

/**
 * Controller pour afficher le dashboard.
 * Récupère tous les utilisateurs, catways et réservations en parallèle.
 *
 * @param {import('express').Request} req - Objet requête Express avec req.user.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const getDashboard = async (req, res, next) => {
  try {
    // Récupérer toutes les données en parallèle
    const [users, catways, reservations] = await Promise.all([
      getAllUsers(),
      getAllCatways(),
      getAllReservations()
    ]);

    res.render("dashboard", {
      user: req.user,
      users,
      catways,
      reservations,
    });
  } catch (error) {
    next(error);
  }
};



/**
 * Controller pour afficher les détails d'un Catway spécifique.
 *
 * @param {import('express').Request} req - Objet requête Express avec req.params.id et req.user.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const getCatwayDetails = async (req, res, next) => {
  try {
    const catway = await getCatwayById(req.params.id);

    if (!catway) {
      // Si le catway n'existe pas, redirige vers le dashboard ou page 404
      return res.status(404).render("404");
    }

    // Rendu de la vue EJS "catwayDetails" avec le catway récupéré
    res.render("catwayDetails", {
      user: req.user,
      catway
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour afficher la liste complète des Catways.
 *
 * @param {import('express').Request} req - Objet requête Express avec req.user.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const getCatwaysListe = async (req, res, next) => {
  try {
    const catways = await getAllCatways(); 
    // rendu de la vue EJS "catwaysListe"
    res.render("catwaysListe", { user: req.user, catways }); 
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère toutes les réservations et les affiche dans la page EJS `reservationsListe`.
 * 
 * Route : GET /reservations/list
 * Middleware : authMiddleware (protégé)
 * 
 * @param {import("express").Request} req - L'objet requête Express
 * @param {import("express").Response} res - L'objet réponse Express
 * @returns {void} - Rend la vue EJS avec la liste des réservations ou renvoie une erreur 500
 */
export const getReservationsListe = async (req, res, next) => {
  try {
    const reservations = await getAllReservations();
    res.render("reservationsListe", { reservations });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller pour afficher la page de documentation API.
 * Route : GET /documentationApi
 *
 * @param {import('express').Request} req - Objet requête Express.
 * @param {import('express').Response} res - Objet réponse Express.
 */
export const getDocumentationApi = (req, res) => {
  res.render("documentationApi");
};

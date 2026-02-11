// Import des services 
import { getAllUsers } from "../services/userService.js";
import { getAllCatways, getCatwayById } from "../services/catwayService.js";
import { getAllReservations } from "../services/reservationService.js";

/**
 * Contrôleur de vue du dashboard utilisateur.
 *
 * Récupére les données nécessaires à l'affichage du dashboard
 * Passe ces données à EJS
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction next pour la gestion des erreurs
 */
export const getDashboard = async (req, res, next) => {
  try {
    const [users, catways, reservations] = await Promise.all([
      getAllUsers(),
      getAllCatways(),
      getAllReservations()
    ]);
    // Rendu de la vue EJS "dashboard"
    res.render("dashboard", {
      user: req.user,   
      users,
      catways,
      reservations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Affiche les détails d'un catway sur une page dédiée.
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction next pour la gestion des erreurs
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
 * Affiche la liste complète des catways.
 *
 * @param {Object} req - Objet Request Express
 * @param {Object} res - Objet Response Express
 * @param {Function} next - Fonction next pour la gestion des erreurs
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




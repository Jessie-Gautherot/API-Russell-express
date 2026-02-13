import {createReservation, getAllReservations, getReservationById, getReservationsByCatway, deleteReservation} from "../services/reservationService.js";

/**
 * Crée une réservation pour un Catway.
 * Route : POST /catways/:catwayId/reservations
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.catwayId - ID du catway
 *   @property {Object} req.body - Données de la réservation
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie de la réservation ou du message de succès
 */
export const createReservationController = async (req, res, next) => {
  try {
    const { catwayId } = req.params;
    const reservationData = req.body;

    const reservation = await createReservation(catwayId, reservationData);

    // succès JSON pour tests automatisés
    if (req.accepts("json")) {
      return res.status(201).json({
        message: "Réservation créée",
        reservation
      });
    }

    // succès HTML, rendu EJS pour l'utilisateur final
    res.render("dashboard", { 
      successMessage: "Réservation créée" 
    });
  } catch (error) {
    // Si erreur : déléguer au middleware et indiquer la vue HTML
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Récupère la liste de toutes les réservations existantes.
 * Route : GET /reservations
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie la liste des réservations en JSON ou HTML
 */
export const getAllReservationsController = async (req, res, next) => {
  try {
    const reservations = await getAllReservations();
    
    // succès JSON pour tests automatisés
    if (req.accepts("json")) {
      return res.json({ reservations });
    }

    // succès HTML, rendu EJS pour l'utilisateur final
    res.render("dashboard", { reservations });
  } catch (error) {
    // Si erreur : déléguer au middleware et indiquer la vue HTML
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Récupère le détail d’une réservation pour un Catway spécifique.
 * Route : GET /catways/:catwayId/reservations/:idReservation
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.catwayId - ID du catway
 *   @property {string} req.params.idReservation - ID de la réservation
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware de gestion d’erreurs
 * @returns {Promise<void>}
 */
export const getReservationByIdController = async (req, res, next) => {
  try {
    const { catwayId, idReservation } = req.params;

    // Toujours passer catwayId au service
    const reservation = await getReservationById(
      idReservation,
      catwayId
    );

    // Réponse HTML (EJS)
    res.render("reservationDetails", { reservation });

  } catch (error) {
    // Permet au middleware d’erreur de savoir quelle vue afficher
    req.renderContext = { view: "reservationDetails" };
    next(error);
  }
};

/**
 * Récupère toutes les réservations d’un Catway spécifique.
 * Route : GET /catways/:catwayId/reservations
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.catwayId - ID du catway
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie les réservations du Catway en JSON ou HTML
 */
export const getReservationsByCatwayController = async (req, res, next) => {
  try {
    const { catwayId } = req.params;
    const reservations = await getReservationsByCatway(catwayId);

    // succès JSON pour tests automatisés
    if (req.accepts("json")) {
      return res.json({ reservations });
    }

    // succès HTML, rendu EJS pour l'utilisateur final
    res.render("dashboard", { reservations });
  } catch (error) {
    // Si erreur : déléguer au middleware et indiquer la vue HTML
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Supprime une réservation par son ID
 * (DELETE /catways/:catwayId/reservations/:idReservation)
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.idReservation - ID de la réservation
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie la réservation supprimée en JSON ou HTML
 */
export const deleteReservationController = async (req, res, next) => {
  try {
    const { idReservation } = req.params;
    const reservation = await deleteReservation(idReservation);
     
    // succès JSON pour tests automatisés
    if (req.accepts("json")) {
      return res.json({
        message: "Réservation supprimée",
        reservation
      });
    }

    // succès HTML, rendu EJS pour l'utilisateur final
    res.render("dashboard", { successMessage: "Réservation supprimée" });
  } catch (error) {
    // Si erreur : déléguer au middleware et indiquer la vue HTML
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

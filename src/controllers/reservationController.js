import {createReservation, getAllReservations, getReservationById, getReservationsByCatway, deleteReservation} from "../services/reservationService.js";
import { sendResponse } from "../utils/response.js";

/**
 * Crée une réservation pour un catway 
 * (POST /catways/:catwayId/reservations)
 */
export const createReservationController = async (req, res, next) => {
  try {
    const { catwayId } = req.params;
    const reservationData = req.body;

    const reservation = await createReservation(catwayId, reservationData);

    sendResponse(req, res, {
      data: { reservation },
      status: 201,
      message: "Réservation créée",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Récupère la liste de toutes les réservations existantes
 * (GET /reservations)
 */
export const getAllReservationsController = async (req, res, next) => {
  try {
    const reservations = await getAllReservations();
    sendResponse(req, res, {
      data: { reservations },
      status: 200,
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Récupère le détail d’une réservation à partir de son ID
 * Route : GET /catways/:catwayId/reservations/:idReservation
 *
 * @async
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction next() pour gérer les erreurs
 * @returns {Promise<void>} Envoie la réservation demandée
 */
export const getReservationByIdController = async (req, res, next) => {
  try {
    const { catwayId, idReservation } = req.params;

    // Appelle le service correspondant
    const reservation = await getReservationById(catwayId, idReservation);

    sendResponse(req, res, {
      data: { reservation },
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

//// route demandée, mais pas fonctionnalité
/**
 * Récupère et liste toutes les réservations d’un catway spécifique via son ID
 * Route : GET /catways/:catwayId/reservations
 *
 * @async
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 * @param {Function} next - Fonction next() pour gérer les erreurs
 * @returns {Promise<void>} Envoie la liste des réservations du catway
 */
export const getReservationsByCatwayController = async (req, res, next) => {
  try {
    const { catwayId } = req.params;
    const reservations = await getReservationsByCatway(catwayId);

    sendResponse(req, res, { 
      data: { reservations }, 
      view: "dashboard" 
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Supprime une réservation par son ID 
 * (DELETE /catways/:catwayId/reservations/:idReservation)
 */
export const deleteReservationController = async (req, res, next) => {
  try {
    const { idReservation } = req.params;
    const reservation = await deleteReservation(idReservation);
    sendResponse(req, res, {
      data: { reservation },
      message: "Réservation supprimée",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

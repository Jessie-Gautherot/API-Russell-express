import mongoose from 'mongoose';
import Reservation from "../models/reservationModel.js";
import Catway from "../models/catwayModel.js";

/**
 * Vérifie la validité des dates de réservation et les convertit en objets Date
 *
 * @param {string|Date} checkIn - Date de début
 * @param {string|Date} checkOut - Date de fin
 * @returns {Object} { start: Date, end: Date }
 * @throws {Error} Si les dates sont invalides ou incohérentes
 */
function validateDates(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime())) {
    const err = new Error("La date de début n'est pas valide");
    err.status = 400;
    throw err;
  }

  if (isNaN(end.getTime())) {
    const err = new Error("La date de fin n'est pas valide");
    err.status = 400;
    throw err;
  }

  if (start >= end) {
    const err = new Error("La date de début doit être avant la date de fin");
    err.status = 400;
    throw err;
  }

  return { start, end };
}

/**
 * Crée une nouvelle réservation pour un catway 
 * (POST /catways/:Id/reservations)
 *
 * @async
 * @param {string} catwayId - ID MongoDB du catway
 * @param {Object} reservationData - Données de la réservation
 * @param {string} reservationData.clientName - Nom du client
 * @param {string} reservationData.boatName - Nom du bateau
 * @param {string|Date} reservationData.checkIn - Date de début de la réservation
 * @param {string|Date} reservationData.checkOut - Date de fin de la réservation
 * @returns {Promise<Reservation>} La réservation créée
 * @throws {Error} Si un champ est manquant, si le catway n'existe pas ou si les dates se chevauchent
 */
export const createReservation = async (catwayId, { clientName, boatName, checkIn, checkOut }) => {
  // Vérification des champs obligatoires
  if (!clientName || !boatName || !checkIn || !checkOut) {
    const err = new Error("Tous les champs sont obligatoires");
    err.status = 400;
    throw err;
  }

  // Vérifier que le catway existe via l'ID de la route
  const catway = await Catway.findById(catwayId);
  if (!catway) {
    const err = new Error("Catway introuvable");
    err.status = 404;
    throw err;
  }

  // Valider et convertir les dates
  const { start, end } = validateDates(checkIn, checkOut);

   // Vérifier qu'il n'y a pas de chevauchement directement dans MongoDB
  const overlapping = await Reservation.findOne({
    catwayNumber: catway.catwayNumber,
    checkIn: { $lt: end },   
    checkOut: { $gt: start } 
  });

  if (overlapping) {
    const err = new Error("Catway déjà réservé pour ces dates");
    err.status = 409;
    throw err;
  }

  // Création et sauvegarde de la réservation
  const reservation = new Reservation({
    catwayNumber: catway.catwayNumber,
    clientName,
    boatName,
    checkIn: start,
    checkOut: end
  });

  return await reservation.save();
};

/**
 * Récupère et liste toutes les réservations existentes  
 * (GET/reservations)
 *
 * @async
 * @returns {Promise<Reservation[]>} Liste de toutes les réservations
 */
export const getAllReservations = async () => {
  return await Reservation.find().sort({ checkIn: 1 });
};

/**
 * Récupère le détail d’une réservation à partir de son ID
 * GET /catways/:catwayId/reservations/:idReservation
 *
 * @async
 * @param {string} catwayId - ID MongoDB du catway
 * @param {string} reservationId - ID MongoDB de la réservation
 * @returns {Promise<Reservation>} La réservation trouvée
 * @throws {Error} Si catway ou reservation n'existent pas, si ID invalide,
 */
export const getReservationById = async (catwayId, reservationId) => {
  // Vérifier que le catway existe
  const catway = await Catway.findById(catwayId);
  if (!catway) {
    const err = new Error("Catway introuvable");
    err.status = 404;
    throw err;
  }

  // Vérifier que l'ID de réservation est valide
  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    const err = new Error("ID de réservation invalide");
    err.status = 400;
    throw err;
  }

  // Récupérer la réservation
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    const err = new Error("Réservation non trouvée");
    err.status = 404;
    throw err;
  }

  return reservation;
};




// route demandée, mais pas fonctionnalité
/**
 * Récupère et liste toutes les réservations d’un catway spécifique via son ID 
 * (GET /catways/:catwayId/reservations)
 *
 * @async
 * @param {string} catwayId - ID MongoDB du catway
 * @returns {Promise<Reservation[]>} Liste des réservations du catway, triées par date de début
 * @throws {Error} Si le catway n'existe pas
 */
export const getReservationsByCatway = async (catwayId) => {
  const catway = await Catway.findById(catwayId);
  if (!catway) {
    const err = new Error("Catway introuvable");
    err.status = 404;
    throw err;
  }

  const reservations = await Reservation.find({
    catwayNumber: catway.catwayNumber
  }).sort({ checkIn: 1 });

  return reservations;
};

/**
 * Supprime une réservation par son ID 
 * (DELETE /catways/:catwayId/reservations/:idReservation)
 *
 * @async
 * @param {string} id - ID MongoDB de la réservation
 * @returns {Promise<Reservation>} Réservation supprimée
 * @throws {Error} Si aucune réservation n'est trouvée
 */
export const deleteReservation = async (id) => {
  // Vérifier que l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("ID invalide");
    err.status = 400;
    throw err;
  }

  // Supprimer la réservation
  const reservation = await Reservation.findByIdAndDelete(id);

  if (!reservation) {
    const err = new Error("Réservation non trouvée");
    err.status = 404;
    throw err;
  }

  return reservation;
};
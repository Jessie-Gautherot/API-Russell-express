import {createCatway, getAllCatways, getCatwayById, updateCatway, patchCatwayState, deleteCatway} from "../services/catwayService.js";
import { sendResponse } from "../utils/response.js";


/**
 * Crée un nouveau catway (POST /catways)
 * 
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {Object} req.body - Données du catway à créer
 *   @property {number} req.body.catwayNumber - Numéro unique du catway
 *   @property {"long"|"short"} req.body.type - Type du catway
 *   @property {string} req.body.catwayState - État initial du catway
 * @param {import("express").Response} res - Réponse Express pour renvoyer JSON ou HTML
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * 
 * @throws {Error} Si des champs obligatoires sont manquants, si le type est invalide ou si le numéro existe déjà
 */
export const createCatwayController = async (req, res, next) => {
  try {
    const catway = await createCatway(req.body);
    sendResponse(req, res, {
      data: { catway },
      message: "Catway créé",
      status: 201,
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Récupère tous les catways (GET /catways)
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 * @param {import("express").Response} res - Réponse Express contenant la liste des catways
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * 
 * @throws {Error} En cas de problème lors de la récupération des données
 */
export const getAllCatwaysController = async (req, res, next) => {
  try {
    const catways = await getAllCatways();
    sendResponse(req, res, {
      data: { catways },
      status : 200,
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Récupère un catway par son ID (GET /catways/:id)
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à récupérer
 * @param {import("express").Response} res - Réponse Express contenant le catway
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * 
 * @throws {Error} Si aucun catway trouvé avec l'ID fourni
 */
export const getCatwayByIdController = async (req, res, next) => {
  try {
    const catway = await getCatwayById(req.params.id);
    sendResponse(req, res, {
      data: { catway },
      status : 200,
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Mise à jour complète d'un catway  (PUT /catways/:id)
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à mettre à jour
 *   @property {Object} req.body - Nouvelles données du catway
 *   @property {number} req.body.catwayNumber - Numéro unique du catway
 *   @property {"long"|"short"} req.body.type - Type du catway
 *   @property {string} req.body.catwayState - État du catway
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * 
 * @throws {Error} Si le catway n'existe pas ou si validation des champs échoue
 */
export const updateCatwayController = async (req, res, next) => {
  try {
    const catway = await updateCatway(req.params.id, req.body);
    sendResponse(req, res, {
      data: { catway },
      status : 200,
      message: "Catway mis à jour",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Met à jour uniquement l'état d'un catway (PATCH /catways/:id)
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à mettre à jour
 *   @property {Object} req.body - Contient l'état à mettre à jour
 *   @property {string} req.body.catwayState - Nouvel état du catway
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * 
 * @throws {Error} Si le catway n'existe pas ou si catwayState est vide ou invalide
 */
export const patchCatwayStateController = async (req, res, next) => {
  try {
    const { catwayState } = req.body;
    const catway = await patchCatwayState(req.params.id, catwayState);
    sendResponse(req, res, {
      data: { catway },
      status : 200,
      message: "État du catway mis à jour",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Supprime un catway (DELETE /catways/:id)
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID du catway à supprimer
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * 
 * @throws {Error} Si aucun catway trouvé avec l'ID fourni
 */
export const deleteCatwayController = async (req, res, next) => {
  try {
    const catway = await deleteCatway(req.params.id);
    sendResponse(req, res, {
      data: { catway },
      status: 200,
      message: "Catway supprimé",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

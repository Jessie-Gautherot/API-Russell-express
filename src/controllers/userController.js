import { createUser, authenticateUser, getUserById, updateUser, deleteUser } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { sendResponse, sanitizeUser } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @typedef {Object} UserData
 * @property {string} name - Nom complet de l'utilisateur
 * @property {string} email - Email de l'utilisateur
 * @property {string} password - Mot de passe de l'utilisateur
 */

/**
 * Crée un nouvel utilisateur.
 *
 * @async
 * @param {import("express").Request} req - Requête Express contenant les données de l'utilisateur dans req.body
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 * @returns {Promise<void>}
 */
export const createUserController = async (req, res, next) => {
  try {
    const user = await createUser(req.body);

    sendResponse(req, res, {
      data: { user: sanitizeUser(user) },
      message: "Utilisateur créé",
      status: 201,
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Authentifie un utilisateur et génère un token JWT.
 *
 * @async
 * @param {import("express").Request} req - Requête Express contenant email et password dans req.body
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 * @returns {Promise<void>}
 */
export const loginUserController = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body);
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    sendResponse(req, res, {
      data: { user: sanitizeUser(user), token },
      message: "Connexion réussie",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Récupère un utilisateur par son ID.
 *
 * @async
 * @param {import("express").Request} req - Requête Express avec req.params.id
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 * @returns {Promise<void>}
 */
export const getUserController = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    sendResponse(req, res, {
      data: { user: sanitizeUser(user) }
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Met à jour un utilisateur existant.
 *
 * @async
 * @param {import("express").Request} req - Requête Express avec req.params.id et req.body
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 * @returns {Promise<void>}
 */
export const updateUserController = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    sendResponse(req, res, {
      data: { user: sanitizeUser(user) },
      message: "Utilisateur mis à jour",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

/**
 * Supprime un utilisateur existant.
 *
 * @async
 * @param {import("express").Request} req - Requête Express avec req.params.id
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 * @returns {Promise<void>}
 */
export const deleteUserController = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);

    sendResponse(req, res, {
      data: { user: sanitizeUser(user) },
      message: "Utilisateur supprimé",
      view: "dashboard"
    });
  } catch (error) {
    error.view = "dashboard";
    next(error);
  }
};

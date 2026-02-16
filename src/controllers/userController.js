import { createUser, authenticateUser, getUserById, getAllUsers, updateUser, deleteUser } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../utils/sanatize.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Controller pour créer un nouvel utilisateur.
 * Route : POST /users
 *
 * @async
 * @param {import("express").Request} req - Objet requête Express avec req.body
 * @param {import("express").Response} res - Objet réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Renvoie l'utilisateur créé en JSON (sanitized)
 */
export const createUserController = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "Utilisateur créé", user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour authentifier un utilisateur.
 * Route : POST /users/login
 *
 * @async
 * @param {import("express").Request} req - Objet requête Express avec req.body
 * @param {import("express").Response} res - Objet réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Redirige vers /dashboard et crée un cookie JWT
 */
export const loginUserController = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body);
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    // Pour les tests, renvoyer le token en JSON
    if (process.env.MOCHA === "true") {
      return res.json({ token });
    }
    // Sinon en prod
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour récupérer un utilisateur par son ID.
 * Route : GET /users/:id
 *
 * @async
 * @param {import("express").Request} req - Objet requête Express avec req.params.id
 * @param {import("express").Response} res - Objet réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Renvoie l'utilisateur en JSON (sanitized)
 */
export const getUserController = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour récupérer tous les utilisateurs.
 * Route : GET /users
 *
 * @async
 * @param {import("express").Request} req - Objet requête Express
 * @param {import("express").Response} res - Objet réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Renvoie la liste des utilisateurs en JSON (sanitized)
 */
export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers(); // récupère tous les utilisateurs
    res.json({ users: users.map(u => sanitizeUser(u)) });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour mettre à jour un utilisateur.
 * Route : PUT /users/:id
 *
 * @async
 * @param {import("express").Request} req - Objet requête Express avec req.params.id et req.body
 * @param {import("express").Response} res - Objet réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Renvoie l'utilisateur mis à jour en JSON (sanitized)
 */
export const updateUserController = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json({ message: "Utilisateur mis à jour", user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour supprimer un utilisateur.
 * Route : DELETE /users/:id
 *
 * @async
 * @param {import("express").Request} req - Objet requête Express avec req.params.id
 * @param {import("express").Response} res - Objet réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Renvoie l'utilisateur supprimé en JSON (sanitized)
 */
export const deleteUserController = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json({ message: "Utilisateur supprimé", user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};





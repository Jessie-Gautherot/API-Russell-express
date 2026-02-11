import { createUser, authenticateUser, getUserById, getAllUsers, updateUser, deleteUser } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../utils/sanatize.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Création d'un nouvel utilisateur
 * Route : POST /users
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
 * Authentification utilisateur
 * Route : POST /users/login
 */
export const loginUserController = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body);
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

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
 * Récupération d'un utilisateur par ID
 * Route : GET /users/:id
 */
export const getUserController = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers(); // récupère tous les utilisateurs
    res.json({ users: users.map(u => sanitizeUser(u)) });
  } catch (error) {
    next(error);
  }
};

/**
 * Mise à jour d'un utilisateur
 * Route : PUT /users/:id
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
 * Suppression d'un utilisateur
 * Route : DELETE /users/:id
 */
export const deleteUserController = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json({ message: "Utilisateur supprimé", user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};





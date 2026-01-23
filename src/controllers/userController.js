import { createUser, authenticateUser, getUserById, updateUser, deleteUser } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { sendResponse, sanitizeUser } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Créer un utilisateur
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

// Connexion / login
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

// Récupérer un utilisateur
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

//Mettre à jour un utilisateur
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

// Supprimer un utilisateur
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

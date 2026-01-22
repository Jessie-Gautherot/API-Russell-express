import {createUser, authenticateUser, getUserById, updateUser, deleteUser} from "../services/userService.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Créer un utilisateur
export const registerUser = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (error) {
    next(error); // on passe l'erreur au middleware global
  }
};

// Authentifier un utilisateur
export const loginUser = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body);
    // Générer un JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
    message: "Authentification OK",
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
  } catch (error) {
    next(error);
  }
};

//Récupérer un utilisateur par ID
export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json({ 
    user: { 
    id: user._id, 
    name: user.name, 
    email: user.email 
  } 
});
  } catch (error) {
    next(error);
  }
};

//Mettre à jour un utilisateur
export const updateUserController = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json({ 
    message: "Utilisateur mis à jour", 
    user: { id: user._id, name: user.name, email: user.email } 
});
  } catch (error) {
    next(error);
  }
};

// Supprimer un utilisateur
export const deleteUserController = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json({ 
    message: "Utilisateur supprimé", 
    user: { id: user._id, name: user.name, email: user.email } 
});
  } catch (error) {
    next(error);
  }
};
import { createUser, authenticateUser, getUserById, updateUser, deleteUser } from "../services/userService.js";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../utils/sanatize.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Crée un nouvel utilisateur
 * Route : POST /users
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {Object} req.body - Données de l'utilisateur à créer
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie l'utilisateur créé en JSON ou HTML
 */
export const createUserController = async (req, res, next) => {
  try {
    // création de l'utilisateur via le service
    const user = await createUser(req.body);

    // succès json (tests automatisés)
    if (req.accepts("json")) {
      return res.status(201).json({
        message: "utilisateur créé",
        // fonction utilitaire pour ne pas renvoyer les mots de passe
        user: sanitizeUser(user) 
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "utilisateur créé"
    });
  } catch (error) {
    // Si erreur : Déléguer au middleware d'erreurs global et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Authentifie un utilisateur et génère un token JWT
 * Route : POST /users/login
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie l'utilisateur et le token en JSON ou redirection HTML
 */
export const loginUserController = async (req, res, next) => {
  try {
    // authentification via le service
    const user = await authenticateUser(req.body);

    // génération du token jwt
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // stockage du token dans un cookie sécurisé
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    // Détection type de requête
    const isAPIRequest = req.headers["content-type"]?.includes("application/json");

    if (isAPIRequest) {
      return res.json({
        message: "connexion réussie",
        user: sanitizeUser(user),
        token
      });
    }

    // succès html : redirection vers le dashboard
    return res.redirect("/dashboard");
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "home" };
    next(error);
  }
};

/**
 * Récupère un utilisateur par son ID
 * Route : GET /users/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID de l'utilisateur
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie l'utilisateur en JSON ou rend le dashboard en HTML
 */
export const getUserController = async (req, res, next) => {
  try {
    // récupération de l'utilisateur via le service
    const user = await getUserById(req.params.id);

    // succès json
    if (req.accepts("json")) {
      return res.json({ user: sanitizeUser(user) });
    }

    // succès html, rendu dashbord
    res.render("dashboard");

  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Met à jour un utilisateur existant
 * Route : PUT /users/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID de l'utilisateur à mettre à jour
 *   @property {Object} req.body - Nouvelles données de l'utilisateur
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie l'utilisateur mis à jour en JSON ou HTML
 */
export const updateUserController = async (req, res, next) => {
  try {
    // mise à jour via le service
    const user = await updateUser(req.params.id, req.body);

    // succès json 
    if (req.accepts("json")) {
      return res.json({
        message: "utilisateur mis à jour",
        user: sanitizeUser(user)
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "utilisateur mis à jour"
    });
    
  } catch (error) {
    // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};

/**
 * Supprime un utilisateur existant
 * Route : DELETE /users/:id
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 *   @property {string} req.params.id - ID de l'utilisateur à supprimer
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Middleware pour erreurs
 * @returns {Promise<void>} Envoie confirmation de suppression en JSON ou HTML
 */
export const deleteUserController = async (req, res, next) => {
  try {
    // suppression via le service
    const user = await deleteUser(req.params.id);

    // succès json
    if (req.accepts("json")) {
      return res.json({
        message: "utilisateur supprimé",
        user: sanitizeUser(user)
      });
    }

    // succès html, rendu ejs pour l'utilisateur final
    res.render("dashboard", {
      successMessage: "utilisateur supprimé"
    });
  } catch (error) {
     // Si erreur : Déléguer au middleware et indiquer la vue html à utiliser
    req.renderContext = { view: "dashboard" };
    next(error);
  }
};


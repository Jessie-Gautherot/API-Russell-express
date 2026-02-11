import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware pour protéger les routes avec JWT.
 * Vérifie la présence et la validité du token JWT.
 *
 * @async
 * @param {import("express").Request} req - Requête Express
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant
 * @returns {Promise<void>}
 * @throws {Error} Si le token est absent ou invalide
 */
export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Récupération du token depuis le header Authorization
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // Sinon, depuis un cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Si pas de token → créer une erreur et passer au middleware d'erreur
    if (!token) {
      return res.status(401).json({ message: "Connexion impossible. Token manquant." });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter l'utilisateur décodé à req pour les controllers suivants
    req.user = { id: decoded.id, email: decoded.email };

    // Passer au middleware suivant / route
    next();
  } catch (error) {
    // Si token invalide ou expiré
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

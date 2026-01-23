import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour protéger les routes avec JWT
export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Depuis le header Authorization
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // Depuis un cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Si pas de token → créer une erreur et passer au middleware d'erreur
    if (!token) {
      const err = new Error("Connexion impossible.");
      err.status = 401;
      req.currentView = "dashboard"; // page à rendre si HTML
      throw err; // passe au errorMiddleware
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter l'utilisateur à req pour les controllers suivants
    req.user = { id: decoded.id, email: decoded.email };

    // Passer au middleware suivant / route
    next();
  } catch (error) {
    // Si token invalide ou expiré
    error.status = 401;
    req.currentView = "dashboard"; // page à rendre si HTML
    next(error); // passe au errorMiddleware
  }
};

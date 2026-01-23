import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


//Middleware pour protéger les routes avec JWT
export const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token JWT
    let token;

    // Depuis le header Authorization 
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Depuis un cookie 
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Si pas de token → 401
    if (!token) {
      return handleUnauthorized(req, res, "connexion impossible.");
    }

    //Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    //Ajouter l'utilisateur à req.user
    req.user = { id: decoded.id, email: decoded.email };

    //Passer au middleware suivant
    next();
  } catch (error) {
    // Si token invalide ou expiré
    return handleUnauthorized(req, res, "Token invalide ou expiré.");
  }
};

//Gestion uniforme de la réponse Unauthorized 
const handleUnauthorized = (req, res, message) => {
  const wantsHTML = req.headers.accept?.includes("text/html");

  if (wantsHTML) {
    return res.status(401).render("dashboard", {
      errorMessage: message
    });
  }

  return res.status(401).json({
    error: message
  });
};

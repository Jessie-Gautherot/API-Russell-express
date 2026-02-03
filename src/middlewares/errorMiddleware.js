/**
 * Middleware global de gestion des erreurs.
 * @param {import("express").ErrorRequestHandler & {status?: number, view?: string}} err - Objet erreur
 * @param {import("express").Request} req - Requête Express
 * @param {import("express").Response} res - Réponse Express
 * @param {import("express").NextFunction} next - Fonction Express suivante
 * @returns {void}
 */
export const errorMiddleware = (err, req, res, next) => {
  // Détecter si le client attend HTML ou JSON
  const wantsHTML = req.headers.accept?.includes("text/html");
  // Déterminer le code HTTP à renvoyer, par défaut 500
  const statusCode = err.status || 500;
  // Message d'erreur à envoyer
  const message = err.message || "Une erreur est survenue";

  //Réponse HTML
  if (wantsHTML) {
    // vue définie par le controller, sinon fallback
    const view = req.renderContext?.view || "home";

    return res.status(statusCode).render(view, {
      errorMessage: message
    });
  }

  // Réponse JSON pour tests
  return res.status(statusCode).json({
    error: message,

    //stack trace uniquement en développement pour faciliter le debug
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

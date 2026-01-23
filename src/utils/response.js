// Fonction utilitaire pour envoyer les réponses aux clients
// Gère automatiquement le rendu HTML ou JSON selon l'entête "Accept"
export const sendResponse = (req, res, { data = {}, message = "", status = 200, view = null }) => {
  // Vérifie si le client souhaite recevoir du HTML
  const wantsHTML = req.headers.accept?.includes("text/html");

  if (wantsHTML) {
    if (!view) throw new Error("Aucune vue fournie pour le rendu HTML"); // ✅ force à fournir la vue
    return res.status(status).render(view, { ...data, successMessage: message });
  }

  // Sinon, renvoie une réponse JSON pour API ou tests
  return res.status(status).json({
    message,
    ...data
  });
};

// Pour exposer l'utilisateur sans mot de passe
export const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
});

import {createCatway,getAllCatways,getCatwayById,updateCatway,patchCatwayState,deleteCatway} from "../services/catwayService.js";

/**
 * Controller pour créer un nouveau Catway.
 * Route : POST /catways
 *
 * @param {import('express').Request} req - Objet requête Express contenant les données du Catway dans req.body.
 * @param {import('express').Response} res - Objet réponse Express pour envoyer la réponse JSON.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const createCatwayController = async (req, res, next) => {
  try {
    const catway = await createCatway(req.body);
    res.status(201).json({ message: "Catway créé", catway });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour récupérer tous les Catways.
 * Route : GET /catways
 *
 * @param {import('express').Request} req - Objet requête Express.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const getAllCatwaysController = async (req, res, next) => {
  try {
    const catways = await getAllCatways();

    // Si le client veut du JSON (ex: fetch)
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ catways });
    }

    // Sinon, renvoie la vue EJS
    res.render("catwaysListe", { catways });

  } catch (err) {
    next(err);
  }
};


/**
 * Controller pour récupérer un Catway par son ID.
 * Route : GET /catways/:id
 *
 * @param {import('express').Request} req - Objet requête Express avec req.params.id.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const getCatwayByIdController = async (req, res, next) => {
  try {
    const catway = await getCatwayById(req.params.id);

    // Si le client demande du JSON (test)
    if (req.headers.accept?.includes("application/json") || process.env.MOCHA === "true") {
      return res.json({ catway });
    }

    // Sinon, renvoie la vue EJS
    res.render("catwayDetails", { catway });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour mettre à jour complètement un Catway.
 * Route : PUT /catways/:id
 *
 * @param {import('express').Request} req - Objet requête Express avec req.params.id et req.body.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const updateCatwayByIdController = async (req, res, next) => {
  try {
    const catway = await updateCatway(req.params.id, req.body);
    res.json({ message: "Catway mis à jour", catway });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour mettre à jour partiellement l'état d'un Catway.
 * Route : PATCH /catways/:id
 *
 * @param {import('express').Request} req - Objet requête Express avec req.params.id et req.body.catwayState.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const patchCatwayStateController = async (req, res, next) => {
  try {
    const { catwayState } = req.body;
    const catway = await patchCatwayState(req.params.id, catwayState);
    res.json({ message: "État du catway mis à jour", catway });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour supprimer un Catway.
 * Route : DELETE /catways/:id
 *
 * @param {import('express').Request} req - Objet requête Express avec req.params.id.
 * @param {import('express').Response} res - Objet réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware d'erreur.
 */
export const deleteCatwayController = async (req, res, next) => {
  try {
    const catway = await deleteCatway(req.params.id);
    res.json({ message: "Catway supprimé", catway });
  } catch (error) {
    next(error);
  }
};


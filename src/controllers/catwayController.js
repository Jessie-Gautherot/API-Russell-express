import {createCatway,getAllCatways,getCatwayById,updateCatway,patchCatwayState,deleteCatway} from "../services/catwayService.js";

/**
 * Création d'un nouveau Catway
 * Route : POST /catways
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
 * Récupère tous les Catways
 * Route : GET /catways
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
 * Récupère un Catway par son ID
 * Route : GET /catways/:id
 */
export const getCatwayByIdController = async (req, res, next) => {
  try {
    const catway = await getCatwayById(req.params.id);
    res.render("catwayDetails", { catway });
  } catch (error) {
    next(error);
  }
};

/**
 * Mise à jour complète d'un Catway
 * Route : PUT /catways/:id
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
 * Mise à jour partielle de l'état d'un Catway
 * Route : PATCH /catways/:id
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
 * Suppression d'un Catway
 * Route : DELETE /catways/:id
 */
export const deleteCatwayController = async (req, res, next) => {
  try {
    const catway = await deleteCatway(req.params.id);
    res.json({ message: "Catway supprimé", catway });
  } catch (error) {
    next(error);
  }
};


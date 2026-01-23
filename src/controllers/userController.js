import {createUser, authenticateUser, getUserById, updateUser, deleteUser} from "../services/userService.js"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

// Créer un utilisateur
export const createUserController = async (req, res, next) => {
  try {
    // Appel du service pour créer un utilisateur
    const user = await createUser(req.body)

    // Détecte si le client attend une page HTML ou JSON
    const wantsHTML = req.headers.accept?.includes("text/html")

    if (wantsHTML) {
      // Rendu HTML sur le dashboard avec message de succès
      return res.render("dashboard", {
        successMessage: "Utilisateur créé avec succès"
      })
    }

    // Rendu JSON pour tests 
    return res.status(201).json({
      message: "Utilisateur créé",
      user: sanitizeUser(user)
    })

  } catch (error) {
    // Transmission de l'erreur au middleware d'erreur
    next(error)
  }
}

// LOGIN UTILISATEUR
export const loginUserController = async (req, res, next) => {
  try {
    // Vérification des identifiants via le service
    const user = await authenticateUser(req.body)
    const wantsHTML = req.headers.accept?.includes("text/html")

    // Création d'un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    if (wantsHTML) {
      // Rendu HTML du dashboard avec token et message
      return res.render("dashboard", {
        user: sanitizeUser(user),
        token,
        successMessage: "Connexion réussie"
      })
    }

    // Rendu JSON pour tests 
    return res.json({
      message: "Authentification réussie",
      token,
      user: sanitizeUser(user)
    })

  } catch (error) {
    // Transmission de l'erreur au middleware d'erreur
    next(error)
  }
}

// RÉCUPÉRER UN UTILISATEUR
export const getUserController = async (req, res, next) => {
  try {
    // Récupération de l'utilisateur via son ID
    const user = await getUserById(req.params.id)

    // Renvoi JSON pour tests
    return res.json({
      user: sanitizeUser(user)
    })

  } catch (error) {
    // Transmission de l'erreur au middleware d'erreur
    next(error)
  }
}

// METTRE À JOUR UN UTILISATEUR
export const updateUserController = async (req, res, next) => {
  try {
    // Mise à jour de l'utilisateur via le service
    const user = await updateUser(req.params.id, req.body)
    const wantsHTML = req.headers.accept?.includes("text/html")

    if (wantsHTML) {
      // Rendu HTML sur dashboard avec message de succès
      return res.render("dashboard", {
        successMessage: "Utilisateur mis à jour"
      })
    }

    // Rendu JSON pour tests
    return res.json({
      message: "Utilisateur mis à jour",
      user: sanitizeUser(user)
    })

  } catch (error) {
    // Transmission de l'erreur au middleware d'erreur
    next(error)
  }
}

// SUPPRIMER UN UTILISATEUR
export const deleteUserController = async (req, res, next) => {
  try {
    // Suppression de l'utilisateur via le service
    const user = await deleteUser(req.params.id)
    const wantsHTML = req.headers.accept?.includes("text/html")

    if (wantsHTML) {
      // Rendu HTML sur dashboard avec message de succès
      return res.render("dashboard", {
        successMessage: "Utilisateur supprimé"
      })
    }

    // Rendu JSON pour tests 
    return res.json({
      message: "Utilisateur supprimé",
      user: sanitizeUser(user)
    })

  } catch (error) {
    // Transmission de l'erreur au middleware d'erreur
    next(error)
  }
}

// UTILITAIRE POUR NE PAS EXPOSER LE MOT DE PASSE
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
})

import { describe, it, before, beforeEach, after } from "mocha";
import { expect } from "chai";
import mongoose from "mongoose";
import {
  createReservation,
  getAllReservations,
  getReservationById,
  deleteReservation
} from "../src/services/reservationService.js";
import Catway from "../src/models/catwayModel.js";
import Reservation from "../src/models/reservationModel.js";

// Construire l'URI MongoDB de test
const MONGO_URI_TEST = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`;

// Connexion à la base de test avant tous les tests
before(async () => {
  // Connexion Mongoose à la base de test
  await mongoose.connect(MONGO_URI_TEST, {
  });
  console.log("Connecté à la base de test");
});

// Déconnexion après tous les tests
after(async () => {
  await mongoose.disconnect();
  console.log("Déconnecté de la base de test");
});

// Début des tests unitaires pour les réservations
describe("Reservation Service - Tests unitaires sur base de test", () => {
  let catway; // Catway factice utilisé pour chaque réservation

  // Avant chaque test : nettoyer les collections
  beforeEach(async () => {
    // Vider toutes les réservations pour que les tests soient indépendants
    await Reservation.deleteMany({});
    // Vider les catways pour repartir d'une base propre
    await Catway.deleteMany({});

    // Créer un catway valide pour attacher les réservations
  catway = await Catway.create({
    catwayNumber: 101,
    type: "long",        
    catwayState: "Bon"   
  });
});

  // Test : création d'une réservation
  it("should create a reservation", async () => {
    const res = await createReservation(catway._id, {
      clientName: "Alice",
      boatName: "Bateau Bleu",
      checkIn: "2026-03-01",
      checkOut: "2026-03-05"
    });

    // Vérifie que la réservation a un _id Mongo valide
    expect(res).to.have.property("_id");
    // Vérifie que le nom du client est correct
    expect(res.clientName).to.equal("Alice");
    console.log("Création de réservation réussie :", res.clientName);
  });

  // Test : lister toutes les réservations
  it("should list all reservations", async () => {
    // Créer une réservation pour tester le listing
    await createReservation(catway._id, {
      clientName: "Alice",
      boatName: "Bateau Bleu",
      checkIn: "2026-03-01",
      checkOut: "2026-03-05"
    });
    const all = await getAllReservations();

    // Vérifie que le résultat est un tableau contenant exactement 1 réservation
    expect(all).to.be.an("array").with.length(1);
    console.log("Listing des réservations :", all.map(r => r.clientName).join(", "));
  });

  // Test : récupérer une réservation par son ID
  it("should get reservation by id", async () => {
    // Créer une réservation test
    const res = await createReservation(catway._id, {
      clientName: "Bob",
      boatName: "Bateau Rouge",
      checkIn: "2026-04-01",
      checkOut: "2026-04-05"
    });

    // Récupère la réservation par son ID et ID du catway
    const found = await getReservationById(res._id, catway._id);

    // Vérifie que le client récupéré est bien "Bob"
    expect(found.clientName).to.equal("Bob");

    // Affiche dans la console pour suivi
    console.log("Récupération réservation par ID réussie :", found.clientName);
  });

  // Test : suppression d'une réservation
  it("should delete a reservation", async () => {
    // Créer une réservation test
    const res = await createReservation(catway._id, {
      clientName: "Bob",
      boatName: "Bateau Rouge",
      checkIn: "2026-04-01",
      checkOut: "2026-04-05"
    });

    // Supprime la réservation via le service 
    const deleted = await deleteReservation(res._id);

    // Vérifie que le client supprimé est bien "Bob"
    expect(deleted.clientName).to.equal("Bob");

    // Vérifie que la collection de réservations est vide après suppression
    const all = await getAllReservations();
    expect(all).to.have.length(0);

    console.log("Suppression de réservation réussie :", deleted.clientName);
  });
});

import { describe, it, before, beforeEach, after } from "mocha";
import { expect } from "chai";
import mongoose from "mongoose";
import Catway from "../src/models/catwayModel.js";
import {
  createCatway,
  getAllCatways,
  getCatwayById,
  patchCatwayState,
  deleteCatway
} from "../src/services/catwayService.js";

// Construire l'URI MongoDB de test 
const MONGO_URI_TEST = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`;

// Connexion et deconexion à la DB de test
before(async () => {
  await mongoose.connect(MONGO_URI_TEST, {
  });
  console.log("Connecté à la base de test");
});

after(async () => {
  await mongoose.disconnect();
  console.log("Déconnecté de la base de test");
});

// Tests unitaires Catway
describe("Tests unitaires Catway", () => {
  let catway; // stockera le catway créé pour certains tests

  // Avant chaque test : vider la collection pour garantir l'indépendance
  beforeEach(async () => {
    await Catway.deleteMany({});
});

  // Test création d'un catway via le service
  it("should create a catway", async () => {
    catway = await createCatway({ catwayNumber: 101, type: "long", catwayState: "Bon" });

    expect(catway).to.have.property("_id"); // vérifie que l'ID Mongo est créé
    expect(catway.catwayNumber).to.equal(101); // vérifie le numéro
    expect(catway.type).to.equal("long");
    expect(catway.catwayState).to.equal("Bon");
    console.log("Création de catway réussie :", catway.catwayNumber);
  });

  // Test liste de tous les catways via le service
  it("should list all catways", async () => {
    await createCatway({ catwayNumber: 102, type: "long", catwayState: "Bon" });
    await createCatway({ catwayNumber: 103, type: "short", catwayState: "Bon" });
    const all = await getAllCatways(); 
    expect(all).to.be.an("array").with.length(2);
    console.log("Liste des catways :", all.map(c => c.catwayNumber).join(", "));
  });

  // Test récupération des details d'un catway par son ID via le service
  it("should get catway by id", async () => {
    catway = await createCatway({ catwayNumber: 104, type: "long", catwayState: "Bon" });

    const found = await getCatwayById(catway._id); 
    expect(found).to.have.property("catwayNumber", 104);
    expect(found.type).to.equal("long");
    console.log("Récupération catway par ID réussie :", found.catwayNumber);
  });

  // Test mise à jour de l'état d'un catway via le service
  it("should update catway state", async () => {
    catway = await createCatway({ catwayNumber: 105, type: "long", catwayState: "Bon" });

    const updated = await patchCatwayState(catway._id, "En maintenance"); 
    expect(updated.catwayState).to.equal("En maintenance");
    console.log("Mise à jour de l'état du catway réussie :", updated.catwayState);
  });

  // Test suppression d'un catway via le service
  it("should delete a catway", async () => {
    catway = await createCatway({ catwayNumber: 106, type: "short", catwayState: "Bon" });

    const deleted = await deleteCatway(catway._id); // service
    expect(deleted.catwayNumber).to.equal(106);

    const all = await getAllCatways();
    expect(all).to.have.length(0); // vérifie que la collection est vide
    console.log("Suppression du catway réussie :", deleted.catwayNumber);
  });
});
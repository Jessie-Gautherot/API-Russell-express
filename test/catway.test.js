import * as chai from "chai";
import request from "supertest";
import app from "../server.js";
import User from "../src/models/userModel.js";
import Catway from "../src/models/catwayModel.js";

const { expect } = chai;

//Tests fonctionnels de la ressource Catway, Réponses JSON uniquement (pas de rendu HTML)

describe("Catway Tests", function () {
  this.timeout(8000);

  // Token JWT utilisé pour accéder aux routes protégées
  let adminToken;

  // ID MongoDB du catway de test
  let catwayId;

  // Utilisateur "bootstrap" pour obtenir un JWT et tester les routes protégées
  const adminUser = {
    name: "Admin Catway",
    email: "admin.catway@example.com",
    password: "admin1234"
  };

  // Données du catway utilisées dans les tests
  const testCatway = {
    catwayNumber: 101,
    type: "long",
    catwayState: "Bon"
  };
  // avant tous les tests
  before(async () => {
    // Nettoyage pour éviter les conflits 
    await User.deleteOne({ email: adminUser.email });
    await Catway.deleteOne({ catwayNumber: testCatway.catwayNumber });

    // Création de l'administrateur dans la DB (hash du mot de passe géré par le modèle)
    await User.create(adminUser);

    // Connexion admin pour obtenir un JWT valide
    const loginRes = await request(app)
      .post("/login")
      .set("Accept", "application/json")
      .send({
        email: adminUser.email,
        password: adminUser.password
      });
      //Stockage du token JWT pour les routes protégées.
    adminToken = loginRes.body.token;
  });

  //Nettoyage après les tests
  after(async () => {
    await User.deleteOne({ email: adminUser.email });
    await Catway.deleteOne({ catwayNumber: testCatway.catwayNumber });
  });

  //test la création d'un catway
  it("should create a catway", async () => {
    const res = await request(app)
      .post("/catways")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .send(testCatway);

    expect(res.status).to.equal(201);
    expect(res.body.catway).to.have.property("catwayNumber", 101);

    // Sauvegarde de l'ID pour les tests suivants
    catwayId = res.body.catway._id;
  });

  // test la récupération de la liste des catways
  it("should get all catways", async () => {
    const res = await request(app)
      .get("/catways")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body.catways).to.be.an("array");
  });

  // Test la récupération d'un catway par ID
  it("should get catway by id", async () => {
    const res = await request(app)
      .get(`/catways/${catwayId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body.catway).to.have.property("catwayNumber", 101);
  });

  // Test la mise à jour complète d'un catway
  it("should update catway fully (PUT)", async () => {
    const res = await request(app)
      .put(`/catways/${catwayId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .send({
        catwayNumber: 101,
        type: "short",
        catwayState: "peinture à refaire entièrement"
      });

    expect(res.status).to.equal(200);
    expect(res.body.catway).to.have.property("type", "short");
  });

  // Test la mise à jour de l'état du catway
  it("should update only catway state (PATCH)", async () => {
    const res = await request(app)
      .patch(`/catways/${catwayId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .send({
        catwayState: "En maintenance"
      });

    expect(res.status).to.equal(200);
    expect(res.body.catway).to.have.property("catwayState", "En maintenance");
  });

  // Test la suppression d'un catway
 
  it("should delete a catway", async () => {
    const res = await request(app)
      .delete(`/catways/${catwayId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
  });

  // Vérification de l'erreur après suppression
  it("should return error when getting deleted catway", async () => {
    const res = await request(app)
      .get(`/catways/${catwayId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("error").that.includes("Catway non trouvé");
  });
});

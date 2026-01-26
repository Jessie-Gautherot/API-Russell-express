import * as chai from "chai";      
import request from "supertest";
import app from "../server.js";
import User from "../src/models/userModel.js";

const { expect } = chai;

describe("User Tests", function () {
  this.timeout(8000);
  // Token JWT utilisé pour accéder aux routes protégées
  let adminUserToken;
  // ID MongoDB de l'utilisateur de test
  let testUserId;

   // Utilisateur "bootstrap" pour obtenir un JWT et tester les routes protégées
  const adminUser = {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin1234"
  };
 // utilisateur des tests
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123"
  };

  // Avant tous les tests 
  before(async () => {
    // Nettoyage préalable pour éviter les conflits
    await User.deleteOne({ email: adminUser.email });
    await User.deleteOne({ email: testUser.email });

    // Créer adminUser directement dans la DB (hash géré par le model)
    await User.create(adminUser);

    // Login adminUser pour récupérer le token, test authentification + JWT.
    const loginRes = await request(app).post("/login").set("Accept", "application/json") .send({
      email: adminUser.email,
      password: adminUser.password
    });
   
    //Stockage du token JWT pour les routes protégées.
    adminUserToken = loginRes.body.token;

    // Créer le testUser via API protégée avec token admin
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminUserToken}`)
      .set("Accept", "application/json")
      .send(testUser);
    //Sauvegarde de l’ID MongoDB du testUser.
    testUserId = res.body.user.id;
  });

  //Après tous les tests : nettoyage
  after(async () => {
    await User.deleteOne({ email: testUser.email });
    await User.deleteOne({ email: adminUser.email });
  });

  // Test connexion testUser
  it("should login testUser and return a JWT token", async () => {
    // Appel réel à la route POST /login
    const res = await request(app).post("/login").send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.status).to.equal(200);
    //Vérifie la présence du token.
    expect(res.body).to.have.property("token");
    // on stocke le token pour tests suivants
    testUser.token = res.body.token; 
  });

  // Test récupération utilisateur par ID
  it("should get testUser by ID", async () => {
    const res = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property("email", testUser.email);
  });

  // Test mise à jour du nom de l'utilisateur par ID
  it("should update testUser name", async () => {
    const res = await request(app)
      .put(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({ name: "Updated User" });

    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property("name", "Updated User");
  });

  //  Test suppression de l'utilisateur par ID
  it("should delete testUser", async () => {
    const res = await request(app)
      .delete(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property("email", testUser.email);
  });

  // Test GET après suppression (devrait renvoyer erreur)
  it("should return error when getting deleted user", async () => {
    const res = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.status).to.equal(500); 
    expect(res.body).to.have.property("error").that.includes("Utilisateur non trouvé");
  });
});expect(res.status).to.equal(500);
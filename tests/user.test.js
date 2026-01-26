import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import User from "../src/models/user.js";

const { expect } = chai;
chai.use(chaiHttp);

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
    const loginRes = await chai.request(app).post("/login").send({
      email: adminUser.email,
      password: adminUser.password
    });
    //Stockage du token JWT pour les routes protégées.
    adminUserToken = loginRes.body.data.token;

    // Créer le testUser via API protégée avec token admin
    const res = await chai.request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminUserToken}`)
      .send(testUser);
    //Sauvegarde de l’ID MongoDB du testUser.
    testUserId = res.body.data.user.id;
  });

  //Après tous les tests : nettoyage
  after(async () => {
    await User.deleteOne({ email: testUser.email });
    await User.deleteOne({ email: adminUser.email });
  });

  // Test connexion testUser
  it("should login testUser and return a JWT token", async () => {
    // Appel réel à la route POST /login
    const res = await chai.request(app).post("/login").send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res).to.have.status(200);
    //Vérifie la présence du token.
    expect(res.body.data).to.have.property("token");
    // on stocke le token pour tests suivants
    testUser.token = res.body.data.token; 
  });

  // Test récupération utilisateur par ID
  it("should get testUser by ID", async () => {
    const res = await chai.request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res).to.have.status(200);
    expect(res.body.data.user).to.have.property("email", testUser.email);
  });

  // Test mise à jour du nom de l'utilisateur par ID
  it("should update testUser name", async () => {
    const res = await chai.request(app)
      .put(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({ name: "Updated User" });

    expect(res).to.have.status(200);
    expect(res.body.data.user).to.have.property("name", "Updated User");
  });

  //  Test suppression de l'utilisateur par ID
  it("should delete testUser", async () => {
    const res = await chai.request(app)
      .delete(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res).to.have.status(200);
    expect(res.body.data.user).to.have.property("email", testUser.email);
  });

  // Test GET après suppression (devrait renvoyer erreur)
  it("should return error when getting deleted user", async () => {
    const res = await chai.request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res).to.have.status(500); 
    expect(res.body).to.have.property("error").that.includes("Utilisateur non trouvé");
  });
});
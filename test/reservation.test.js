import * as chai from "chai";
import request from "supertest";
import app from "../server.js";
import User from "../src/models/userModel.js";
import Reservation from "../src/models/reservationModel.js";
import Catway from "../src/models/catwayModel.js";

const { expect } = chai;

describe("Reservation Tests", function () {
  this.timeout(8000); 
  // Token JWT pour accéder aux routes protégées
  let adminToken;  
  // Stocke l'ID MongoDB de la réservation de test    
  let reservationId;   
  // Stoke l'ID MongoDB du catway de test
  let catwayId

  // Utilisateur "admin" pour authentification
  const adminUser = {
    name: "Admin Reservation",
    email: "admin.reservation@example.com",
    password: "admin1234"
  };

  // Données de la réservation utilisée dans les tests
  const testReservation = {
    catwayNumber: 101,
    clientName: "John Doe",
    boatName: "Black Pearl",
    checkIn: new Date("2026-02-01T10:00:00Z"),
    checkOut: new Date("2026-02-05T18:00:00Z")
  };

  // Avant tous les tests : nettoyage 
  before(async () => {
    // Supprime les éventuels doublons dans la base
    await User.deleteOne({ email: adminUser.email });
    await Reservation.deleteMany({ catwayNumber: testReservation.catwayNumber });
    await Catway.deleteOne({ catwayNumber: testReservation.catwayNumber });

    // Création de l'administrateur pour obtenir un JWT valide
    await User.create(adminUser);

    // Connexion admin pour obtenir un token JWT
    const loginRes = await request(app)
      .post("/login")
      .set("Accept", "application/json")
      .send({ email: adminUser.email, password: adminUser.password });
    // Stockage du JWT pour les tests
    adminToken = loginRes.body.token; 

    // Création du catway de test
    const catway = await Catway.create({
      catwayNumber: testReservation.catwayNumber,
      type: "long",
      catwayState: "bon"
    });

  catwayId = catway._id;
});

  // Après tous les tests : nettoyage
  after(async () => {
    await User.deleteOne({ email: adminUser.email });
    await Reservation.deleteMany({ catwayNumber: testReservation.catwayNumber });
  });

  // Test création d'une réservation
  it("should create a reservation", async () => {
    const res = await request(app)
      .post(`/catways/${catwayId}/reservations`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .send(testReservation);

    expect(res.status).to.equal(201); 
    expect(res.body.reservation).to.have.property("clientName", testReservation.clientName);

    // Stocke l'ID pour tests suivants
    reservationId = res.body.reservation._id; 
  });

  // Test récupération de toutes les réservations
  it("should get all reservations", async () => {
    const res = await request(app)
      .get("/reservations")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body.reservations).to.be.an("array"); 
  });

  // Test récupération d'une réservation par ID 
  it("should get reservation by id", async () => {
    const res = await request(app)
      .get(`/catways/${catwayId}/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body.reservation).to.have.property("boatName", testReservation.boatName);
  });

  // Test suppression d'une réservation
  it("should delete a reservation", async () => {
    const res = await request(app)
      .delete(`/catways/${catwayId}/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200); 
  });

  // Test d'erreur après suppression 
  it("should return error when getting deleted reservation", async () => {
    const res = await request(app)
      .get(`/catways/${catwayId}/reservations/${reservationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json");

    // Le service doit renvoyer 404 si la réservation n'existe pas
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error").that.includes("Réservation non trouvée");
  });
});

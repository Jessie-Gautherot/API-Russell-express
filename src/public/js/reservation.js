document.addEventListener("DOMContentLoaded", () => {
  const createForm = document.getElementById("create-reservation-form");

  const deleteSection = document.getElementById("delete-reservation-section");
  const deleteForm = document.getElementById("delete-reservation-form");
  const deleteIdInput = document.getElementById("delete-reservation-id");
  const deleteCatwayInput = document.getElementById("delete-reservation-catway");
  const deleteClientNameSpan = document.getElementById("delete-reservation-client");

  const viewSection = document.getElementById("view-reservation-section");
  const viewForm = document.getElementById("view-reservation-form");
  const viewIdInput = document.getElementById("view-reservation-id");
  const viewCatwayInput = document.getElementById("view-reservation-catway");
  const viewClientNameSpan = document.getElementById("view-reservation-client");

  const reservationsTableBody = document.getElementById("reservations-table").querySelector("tbody");

  function hideAllSections() {
    deleteSection.style.display = "none";
    viewSection.style.display = "none";
  }

  //Création réservation
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const catwayId = createForm.catwaySelect.value; // récupère le vrai ID
  const data = {
    clientName: createForm.clientName.value,
    boatName: createForm.boatName.value,
    checkIn: createForm.checkIn.value,
    checkOut: createForm.checkOut.value
  };

    try {
      const res = await fetch(`/catways/${catwayId}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur création réservation");

      alert("Réservation créée !");
      createForm.reset();
      window.location.reload(); // recharge EJS pour afficher la nouvelle réservation
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Gestion des boutons tableau
  reservationsTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    const catwayId = btn.dataset.catway;
    const client = btn.dataset.client;

    if (btn.classList.contains("delete-reservation-btn")) {
      hideAllSections();
      deleteIdInput.value = id;
      deleteCatwayInput.value = catwayId;
      deleteClientNameSpan.textContent = client;
      deleteSection.style.display = "block";
      deleteSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (btn.classList.contains("details-reservation-btn")) {
      hideAllSections();
      viewIdInput.value = id;
      viewCatwayInput.value = catwayId;
      viewClientNameSpan.textContent = client;
      viewSection.style.display = "block";
      viewSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Suppression réservation
  deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = deleteIdInput.value;
    const catwayId = deleteCatwayInput.value;
    if (!id || !catwayId) return alert("ID ou Catway manquant !");
    if (!confirm("Confirmer la suppression ?")) return;

    try {
      const res = await fetch(`/catways/${catwayId}/reservations/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur suppression réservation");

      alert("Réservation supprimée !");
      hideAllSections();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Voir détails réservation
  viewForm.addEventListener("submit", e => {
    e.preventDefault();
    const id = viewIdInput.value;
    const catwayId = viewCatwayInput.value;
    if (!id || !catwayId) return alert("ID ou Catway manquant !");
    window.location.href = `/catways/${catwayId}/reservations/${id}`;
  });

  // Annuler
  document.querySelectorAll(".cancel-reservation-btn").forEach(btn => btn.addEventListener("click", hideAllSections));
});



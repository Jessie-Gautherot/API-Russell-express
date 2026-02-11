/**
 * Gestion dynamique des Catways
 * Création
 * Modification de l'état d'un catway
 * Suppression d'un catway
 * Consultation des détails d'un catway
 * Affichage de la liste des catway
 * 
 */

document.addEventListener("DOMContentLoaded", () => {
  
  //Récupération des éléments html
  const createForm = document.getElementById("create-catway-form");
  const updateSection = document.getElementById("update-catway-section");
  const updateForm = document.getElementById("update-catway-form");
  const deleteSection = document.getElementById("delete-catway-section");
  const deleteForm = document.getElementById("delete-catway-form");
  const deleteNumberSpan = document.getElementById("delete-catway-number");

  const viewSection = document.getElementById("view-catway-section");
  const viewForm = document.getElementById("view-catway-form");
  const viewNumberSpan = document.getElementById("view-catway-number");

  const catwaysTableBody = document.getElementById("catways-table").querySelector("tbody");

  const updateHiddenId = updateForm.querySelector('input[name="id"]');
  const deleteHiddenId = deleteForm.querySelector('input[name="id"]');
  const viewHiddenId = viewForm.querySelector('input[name="id"]');

  // Fonction utilitaire pour cacher toutes les sections
  function hideAllSections() {
    updateSection.style.display = "none";
    deleteSection.style.display = "none";
    viewSection.style.display = "none";
  }

  // Récupère tous les catways
  async function refreshCatwaysTable() {
    try {
      const res = await fetch("/catways", {
        method: "GET",
        headers: {
        "Accept": "application/json"},
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de charger les catways");
      // création du tableau
      catwaysTableBody.innerHTML = "";
      data.catways.forEach(catway => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${catway.catwayNumber}</td>
          <td>${catway.type}</td>
          <td>${catway.catwayState}</td>
          <td>
            <button type="button" class="edit-catway-btn" 
              data-id="${catway._id}" 
              data-number="${catway.catwayNumber}" 
              data-type="${catway.type}" 
              data-state="${catway.catwayState}">Modifier</button>

            <button type="button" class="delete-catway-btn" 
              data-id="${catway._id}" 
              data-number="${catway.catwayNumber}">Supprimer</button>

            <button type="button" class="details-catway-btn" 
              data-id="${catway._id}" 
              data-number="${catway.catwayNumber}">Voir détails</button>
          </td>
        `;
        catwaysTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Initialisation du tableau
  refreshCatwaysTable();

  
  // Création d'un Catway
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      catwayNumber: createForm.catwayNumber.value,
      type: createForm.type.value,
      catwayState: createForm.catwayState.value
    };

    try {
      const res = await fetch("/catways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur création catway");

      alert("Catway créé !");
      createForm.reset();
      refreshCatwaysTable();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Gestion des boutons du tableau entier
  catwaysTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    const number = btn.dataset.number;
    const type = btn.dataset.type;
    const state = btn.dataset.state;

    
    // Si modifier
    if (btn.classList.contains("edit-catway-btn")) {
      hideAllSections();
      updateHiddenId.value = id;
      updateForm.querySelector("#update-catway-number").value = number;
      updateForm.querySelector("#update-catway-type").value = type;
      updateForm.querySelector("#update-catway-state").value = state;
      updateForm.action = `/catways/${id}`; // pour method-override
      updateSection.style.display = "block";
      updateSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    //Si supprimer
    if (btn.classList.contains("delete-catway-btn")) {
      hideAllSections();
      deleteHiddenId.value = id;
      deleteNumberSpan.textContent = number;
      deleteForm.action = `/catways/${id}`; // pour method-override ? c'est plus la
      deleteSection.style.display = "block";
      deleteSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Voir détails d'un catway
    if (btn.classList.contains("details-catway-btn")) {
      hideAllSections();
      viewHiddenId.value = id;
      viewNumberSpan.textContent = number;
      viewSection.style.display = "block";
      viewSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Mise à jour de l'éat d'un Catway
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = updateHiddenId.value;
    if (!id) return alert("ID catway manquant !");

    const data = {
      catwayState: updateForm.catwayState.value
    };

    try {
      const res = await fetch(`/catways/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur modification état d'un catway");

      alert("Etat du catway mis à jour !");
      updateForm.reset();
      hideAllSections();
      refreshCatwaysTable();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Suppression d'un Catway
  deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = deleteHiddenId.value;
    if (!id) return alert("ID catway manquant !");
    if (!confirm("Confirmer la suppression ?")) return;

    try {
      const res = await fetch(`/catways/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur suppression catway");

      alert("Catway supprimé !");
      deleteForm.reset();
      hideAllSections();
      refreshCatwaysTable();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Soumission formulaire détails → redirection
  viewForm.addEventListener("submit", e => {
    e.preventDefault();
    const id = viewHiddenId.value;
    if (!id) return alert("ID catway manquant !");
    window.location.href = `/catways/${id}`;
  });

  // Boutons annuler, cache les formulaires
  document.querySelectorAll(".cancel-catway-btn").forEach(btn => {
    btn.addEventListener("click", hideAllSections);
  });

  document.getElementById("cancel-view-catway-btn").addEventListener("click", hideAllSections);
});



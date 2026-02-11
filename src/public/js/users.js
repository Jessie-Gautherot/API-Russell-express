//le script ne s'exécute que lorsque toute la page HTML est chargée
document.addEventListener("DOMContentLoaded", () => {
  //Récupération des éléments html
  const createForm = document.getElementById("create-user-form");
  const updateSection = document.getElementById("update-section");
  const updateForm = document.getElementById("update-user-form");
  const deleteSection = document.getElementById("delete-section");
  const deleteForm = document.getElementById("delete-user-form");
  //Pour insérer les utilisateurs dans le <tbody> du tableau
  const usersTableBody = document.getElementById("users-table").querySelector("tbody");
  //champs cachés pour stocker l’ID de l’utilisateur sélectionné dans les formulaires
  const updateHiddenId = document.getElementById("update-user-id");
  const deleteHiddenId = document.getElementById("delete-user-id");
  //Pour afficher le nom de l'utilisateur à supprimer
  const deleteUserName = document.getElementById("delete-user-name");


  // Récupère tous les utilisateurs
  async function refreshUsersTable() {
    try {
      const res = await fetch("/users", { 
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // token
        credentials: "include"
      });
      const data = await res.json();
      // faudrait passer au middleware???
      if (!res.ok) throw new Error(data.message || "Impossible de charger les utilisateurs");
      // On créer le tableau
      usersTableBody.innerHTML = "";
      data.users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button type="button" class="edit-btn" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}">Modifier</button>
            <button type="button" class="delete-btn" data-id="${user.id}" data-name="${user.name}">Supprimer</button>
          </td>
        `;
        usersTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Afficher ou cacher les sections
  function hideAllSections() {
    updateSection.style.display = "none";
    deleteSection.style.display = "none";
  }

  refreshUsersTable();

  // Création utilisateur
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: createForm.name.value,
      email: createForm.email.value,
      password: createForm.password.value
    };

    try {
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur création utilisateur");

      alert("Utilisateur créé !");
      createForm.reset();
      refreshUsersTable();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // on écoute les clics sur le tableau entier
  usersTableBody.addEventListener("click", (e) => {
    const btn = e.target;
    const { id, name, email } = btn.dataset;
    //Si Modifier :on remplit le formulaire de mise à jour et on l’affiche.
    if (btn.classList.contains("edit-btn")) {
      updateHiddenId.value = id;
      updateForm.name.value = name;
      updateForm.email.value = email;
      updateForm.password.value = "";
      updateSection.style.display = "block";
      deleteSection.style.display = "none";
      //Si supprimer: on affiche la section de suppression avec le nom de l’utilisateur.
    } else if (btn.classList.contains("delete-btn")) {
      deleteHiddenId.value = id;
      deleteUserName.textContent = name;
      deleteSection.style.display = "block";
      updateSection.style.display = "none";
    }
  });

  // formulaire de mise à jour.
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = updateHiddenId.value;
    if (!id) return alert("ID utilisateur manquant !");
    
    const data = {
      name: updateForm.name.value,
      email: updateForm.email.value,
      password: updateForm.password.value
    };

    try {
      const res = await fetch(`/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur modification");

      alert("Utilisateur modifié !");
      updateForm.reset();
      hideAllSections();
      refreshUsersTable();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // formulaire de suppression.
  deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = deleteHiddenId.value;
    if (!id) return alert("ID utilisateur manquant !");
    if (!confirm("Confirmer la suppression ?")) return;

    try {
      const res = await fetch(`/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur suppression");

      alert("Utilisateur supprimé !");
      deleteForm.reset();
      hideAllSections();
      refreshUsersTable();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // Annuler pour cacher les formulaires
  document.querySelectorAll(".cancel-btn").forEach(btn =>
    btn.addEventListener("click", hideAllSections)
  );
});






 
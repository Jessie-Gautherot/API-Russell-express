document.addEventListener("DOMContentLoaded", () => {
  const updateSection = document.querySelector("#update-section");
  const deleteSection = document.querySelector("#delete-section");

  const updateForm = document.querySelector("#update-user-form");
  const deleteForm = document.querySelector("#delete-user-form");

  // Boutons Modifier
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateSection.style.display = "block";   // afficher le formulaire modification
      deleteSection.style.display = "none";    // masquer le formulaire suppression

      updateForm.action = `/users/${btn.dataset.id}`;
      updateForm.name.value = btn.dataset.name;
      updateForm.email.value = btn.dataset.email;
      updateForm.password.value = "";

      updateForm.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Boutons Supprimer
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteSection.style.display = "block";   // afficher le formulaire suppression
      updateSection.style.display = "none";    // masquer le formulaire modification

      deleteForm.action = `/users/${btn.dataset.id}`;
      deleteForm.querySelector("input[name='id']").value = btn.dataset.id;

    // afficher le nom de l'utilisateur à supprimer
    const deleteNameSpan = document.querySelector("#delete-user-name");
    deleteNameSpan.textContent = btn.dataset.name;

    deleteForm.scrollIntoView({ behavior: "smooth" });
  });
});

  // Boutons Annuler
  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("section").style.display = "none";
    });
  });
});


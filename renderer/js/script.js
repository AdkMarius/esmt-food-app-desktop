
    function closeForm() {
      ipcRenderer.send('close-main-window');
    }

    // Assurez-vous que le script est exécuté après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ciblez le formulaire ou le bouton de soumission
    const loginForm = document.getElementById('login-form');
    
    // Ajoutez un gestionnaire d'événements pour empêcher l'envoi du formulaire et rediriger l'utilisateur
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Empêche le comportement de soumission par défaut
      window.location.href = 'produits.html'; // Redirige vers produits.html
    });
  });
  
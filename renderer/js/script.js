//fermer la page
function closeForm() {
    ipcRenderer.send('close-main-window');
}


    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('login-form');
      
        loginForm.addEventListener('submit', function(event) {
          event.preventDefault(); // Empêche l'envoi du formulaire par défaut
      
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
      
          // Charger les utilisateurs depuis le fichier JSON
          fetch('data/users.json')
            .then(response => response.json())
            .then(users => {
              // Vérifier les informations d'identification
              const user = users.find(u => u.username === username && u.password === password);
      
              if (user) {
                // Authentification réussie, redirection vers produits.html
                window.location.href = 'produits.html';
              } else {
                // Authentification échouée, afficher un message d'erreur
                alert('Nom d’utilisateur ou mot de passe incorrect');
              }
            })
            .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));
        });
      });
      
  

  function loadOrders() {
    fetch('orders.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('orders-table-body');
            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.reference}</td>
                    <td>${order.date}</td>
                    <td>${order.price_total.toFixed(2)} €</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}


document.addEventListener('DOMContentLoaded', loadOrders);
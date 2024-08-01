//fermer la page
function closeForm() {
    ipcRenderer.send('close-main-window');
}

    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('login-form');
      
        loginForm.addEventListener('submit', function(event) {
          event.preventDefault(); 
      
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
    fetch('data/orders.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('orders-table-body');
            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.reference}</td>
                    <td>${order.date}</td>
                    <td>${order.price_total.toFixed(2)} F</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}


document.addEventListener('DOMContentLoaded', loadOrders);



document.addEventListener("DOMContentLoaded", function() {
  // Fetch the products data
  fetch('data/produits.json')
      .then(response => response.json())
      .then(products => {
          const productList = document.getElementById('product-list');
          products.forEach(product => {
              // Create card element
              const card = document.createElement('div');
              card.className = 'card';
              
              if (product.image) {
                  const img = document.createElement('img');
                  img.className = 'card-img-top';
                  img.src = product.image;
                  img.alt = product.name;
                  card.appendChild(img);
              }

              // Card body
              const cardBody = document.createElement('div');
              cardBody.className = 'card-body';
              card.appendChild(cardBody);

              // Product name
              const name = document.createElement('p');
              name.className = 'card-text';
              name.innerText = product.name;
              cardBody.appendChild(name);

              // Price and action icon
              const details = document.createElement('div');
              details.className = 'details';
              cardBody.appendChild(details);

              const price = document.createElement('p');
              price.className = 'price';
              price.innerText = product.price + ' F';
              details.appendChild(price);

              const viewIcon = document.createElement('img');
              viewIcon.className = 'img-fluid'
              viewIcon.src = 'image/voir.png';
              viewIcon.alt = 'Voir';
              details.appendChild(viewIcon);

              productList.appendChild(card);
          });
      })
      .catch(error => console.error('Error loading products:', error));
});
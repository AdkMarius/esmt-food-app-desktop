//fermer la page
function closeForm() {
    ipcRenderer.send('close-main-window');
}

//Authentification
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const email = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('http://localhost:3000/api/auth/sign-in', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (response.ok) {
              // Authentification réussie, redirection vers produits.html
              window.location.href = 'produits.html';
          } else {
              // Authentification échouée, afficher un message d'erreur
              alert(result.message);
          }
      } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          alert('Erreur lors de la connexion. Veuillez réessayer plus tard.');
      }
  });
});

  
//Historique
async function loadOrders() {
  try {
      const response = await fetch('http://localhost:3000/api/orders/list');
      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
      }

      const tableBody = document.getElementById('orders-table-body');
      tableBody.innerHTML = ''; 

      data.data.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${order.id}</td>
              <td>${order.created_at}</td>
              <td>${order.total_price.toFixed(2)} F</td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
  }
}



document.addEventListener('DOMContentLoaded', loadOrders);


//Produits liste, ajout et mise à jour

document.addEventListener("DOMContentLoaded", function() {
  // Fetch the products data
  fetch('http://localhost:3000/api/products/list')
      .then(response => response.json())
      .then(products => {
          const productList = document.getElementById('product-list');
          products.data.forEach(product => {
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
              viewIcon.className = 'img-fluid';
              viewIcon.src = 'image/voir.png';
              viewIcon.alt = 'Voir';
              viewIcon.style.cursor = 'pointer';
              details.appendChild(viewIcon);

              viewIcon.addEventListener('click', () => {
                  document.getElementById('productName').value = product.name;
                  document.getElementById('productPrice').value = product.price;
                  document.getElementById('productId').value = product.id;
                  $('#editProductModal').modal('show');
              });

              productList.appendChild(card);
          });
      })
      .catch(error => console.error('Error loading products:', error));

  // Save changes event
  document.getElementById('saveProductChanges').addEventListener('click', () => {
      const productId = document.getElementById('productId').value;
      const updatedProduct = {
          name: document.getElementById('productName').value,
          price: document.getElementById('productPrice').value
      };

      fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProduct)
      })
      .then(response => response.json())
      .then(data => {
          if (data.message === 'Product read successfully') {
              alert('Product updated successfully');
              $('#editProductModal').modal('hide');
             
              location.reload();
          } else {
              alert('Error updating product');
          }
      })
      .catch(error => console.error('Error updating product:', error));
  });
});


//Commandes 

document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.getElementById('orders-list');
    const orderDetails = document.getElementById('order-details');
    const newOrdersTab = document.getElementById('new-orders');
    const ongoingOrdersTab = document.getElementById('ongoing-orders');

    
    async function fetchOrders(status) {
        const response = await fetch(`http://localhost:3000/api/orders?status=${status}`);
        const data = await response.json();
        return data.data;
    }

    // Fonction pour afficher les commandes
    async function displayOrders(status) {
        ordersList.innerHTML = '';
        const orders = await fetchOrders(status);
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            orderCard.innerHTML = `
                <p>Commande ${order.id}</p>
                <button class="btn btn-sm" onclick="showOrderDetails(${order.id})">Voir</button>
            `;
            ordersList.appendChild(orderCard);
        });
    }

    // Fonction pour afficher les détails d'une commande
    async function showOrderDetails(orderId) {
        const response = await fetch(`http://localhost:3000/api/orders/details/${orderId}`);
        const data = await response.json();
        const order = data.data[0];
        orderDetails.innerHTML = `
            <h4>Commande ${order.id}</h4>
            <div class="order-item">
                <img src="${order.order_items[0].products.image_url}" alt="${order.order_items[0].products.name}" width="50">
                <span>${order.order_items[0].products.name}</span>
                <span>${order.order_items[0].price} f</span>
            </div>
            <div class="order-item">
                <img src="${order.order_items[1].products.image_url}" alt="${order.order_items[1].products.name}" width="50">
                <span>${order.order_items[1].products.name}</span>
                <span>${order.order_items[1].price} f</span>
            </div>
            <button onclick="updateOrderStatus(${order.id}, 'delivering')">En cours</button>
            <button onclick="updateOrderStatus(${order.id}, 'delivered')">Prête</button>
        `;
        orderDetails.style.display = 'block';
    }

    // Fonction pour mettre à jour le statut d'une commande
    async function updateOrderStatus(orderId, status) {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        console.log(data.message);
    }

    // Gestion des onglets
    newOrdersTab.addEventListener('click', () => {
        newOrdersTab.classList.add('active');
        ongoingOrdersTab.classList.remove('active');
        displayOrders('New');
    });

    ongoingOrdersTab.addEventListener('click', () => {
        ongoingOrdersTab.classList.add('active');
        newOrdersTab.classList.remove('active');
        displayOrders('delivering');
    });

    
    displayOrders('New');
});

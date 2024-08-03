//fermer la page
function closeForm() {
    ipcRenderer.send('close-main-window');
}

//***********************************************AUTHENTIFICATION ************************************//


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



  
//**********************************************HISTORIQUE************************************************/


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









//*********************************************PRODUITS***********************************************//

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
                    document.getElementById('productIsDayMenu').checked = product.isDayMenu;
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
            price: document.getElementById('productPrice').value,
            isDayMenu: document.getElementById('productIsDayMenu').checked
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
            if (data.success) {
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



//Ajout de produit

document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById('addButton');
    const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));

    addButton.addEventListener('click', function() {
        addProductModal.show();
    });

    
    document.getElementById('addProductButton').addEventListener('click', function() {
        const name = document.getElementById('newProductName').value;
        const price = document.getElementById('newProductPrice').value;
        const id_category= document.getElementById('category').value;
        
        if (name && price && id_category ) {
        
            fetch('http://localhost:3000/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    price: price, 
                    isAvailable: "TRUE",
                    isDayMenu: "FALSE",
                    id_category: id_category,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    
                    addProductModal.hide();
                    location.reload();

                    
                } else {
                    alert('Failed to add product');
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Please fill out all fields');
        }
    });
});







//*********************************COMMANDES*******************************************//


 // Fonction pour afficher les détails d'une commande
async function showOrderDetails(orderId) {
    const response = await fetch(`http://localhost:3000/api/orders/details/${orderId}`);
    const data = await response.json();
    const order = data.data[0];
    const orderDetails = document.getElementById('order-details');
    const modal = document.getElementById('order-modal');

    let itemsHtml = '';
    order.order_items.forEach(item => {
        itemsHtml += `
            <div class="order-item">
                <img src="${item.products.image}" width="50">
                <span>${item.products.name}</span>
                <span>${item.products.price} f</span>
            </div>
        `;
    });

    const newOrdersTab = document.getElementById('new-orders');
    const isOngoingOrder = !newOrdersTab.classList.contains('active'); 

    orderDetails.innerHTML = `
        <h4>Commande ${order.id}</h4>
        ${itemsHtml}
        <button id="deliverBtn" onclick="updateOrderStatus(${order.id}, 'Delivering')" style="${isOngoingOrder ? 'display:none;' : ''}">En cours</button>
        <button id="readyBtn" onclick="updateOrderStatus(${order.id}, 'Delivered')" style="${isOngoingOrder ? '' : 'display:none;'}">Prête</button>
    `;

    modal.style.display = 'block';

    const closeModal = () => {
        modal.style.display = 'none';
    };

    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
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
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.getElementById('orders-list');
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
                <button class="btn btn-sm voir-btn" onclick="showOrderDetails(${order.id})">Voir</button>
            `;
            ordersList.appendChild(orderCard);
        });
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
        displayOrders('Delivering');
    });

    displayOrders('New');
});



//*****************************************CATEGORIES************************************************/

document.addEventListener("DOMContentLoaded", async function() {
    const apiUrl = 'http://localhost:3000/api/categories';
    const productsUrl = 'http://localhost:3000/api/products/list';

    try {
        // Fetch categories
        const categoryResponse = await fetch(apiUrl);
        const categoryResult = await categoryResponse.json();
        
        if (!categoryResponse.ok) {
            throw new Error(categoryResult.message || 'Failed to fetch categories');
        }

        const cardGroup = document.getElementById('category-cards');
        cardGroup.innerHTML = '';

        const categoriesRow = document.createElement('div');
        categoriesRow.className = 'row carte ml-3';

        categoryResult.data.forEach(category => {
            const col = document.createElement('div');
            col.className = 'col-3 text-center';
            
            const img = document.createElement('img');
            img.className = 'cat-img clickable';
            img.src = category.image || 'default_image_path.jpg'; 
            img.alt = category.name;
            img.dataset.categoryId = category.id;

            const title = document.createElement('h6');
            title.className = 'cat-title';
            title.innerText = category.name;

            col.appendChild(img);
            col.appendChild(title);
            categoriesRow.appendChild(col);
        });

        cardGroup.appendChild(categoriesRow);

        // Fetch products
        const productResponse = await fetch(productsUrl);
        const productResult = await productResponse.json();

        if (!productResponse.ok) {
            throw new Error(productResult.message || 'Failed to fetch products');
        }

        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        // Function to display products
        function displayProducts(products) {
            productList.innerHTML = '';
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
        }

        
        displayProducts(productResult.data);

    
        document.querySelectorAll('.clickable').forEach(element => {
            element.addEventListener('click', () => {
                const categoryId = element.dataset.categoryId;
                const filteredProducts = productResult.data.filter(product => product.id_category === parseInt(categoryId));
                displayProducts(filteredProducts);
            });
        });

        
        document.getElementById('show-all-products').addEventListener('click', () => {
            displayProducts(productResult.data);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
});



//*********************************************************Dashboard******************************* */
const ctx = document.getElementById("revenues");

Chart.defaults.color = "#FFF";
Chart.defaults.font.family = "Open Sans";

new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Fev",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aou",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenus",
        data: [
          5, 1.8, 1.3, 1.2, 1.5, 2.8, 3.5, 4, 4.5, 5, 5.5, 6,
        ],
        backgroundColor: "#F4BD50",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  },
  // continuation

  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Revenu de votre compagnie en 2024",
        padding: {
          bottom: 16,
        },
        font: {
          size: 16,
          weight: "normal",
        },
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
      },
    },
    scales: {
      x: {
        border: {
          dash: [2, 4],
        },
        grid: {
          color: "#27292D",
        },
        title: {
          text: "2023",
        },
      },
      y: {
        grid: {
          color: "#27292D",
        },
        border: {
          dash: [2, 4],
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (million [f])",
        },
      },
    },
  },
});


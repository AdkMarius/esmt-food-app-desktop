
    function closeForm() {
      ipcRenderer.send('close-main-window');
    }

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
      window.location.href = 'produits.html'; 
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
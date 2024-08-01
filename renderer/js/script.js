
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
  


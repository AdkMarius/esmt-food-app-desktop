import React from 'react';
import './index.css'; 

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <img src="https://via.placeholder.com/965x544" alt="Background" className="login-image" />
      </div>
      
      <div className="login-right">
        <h2>Se Connecter</h2>
        <form className="login-form">
          <label htmlFor="username">Identifiant</label>
          <input type="text" id="username" name="username" required />

          <label htmlFor="password">Mot de Passe</label>
          <input type="password" id="password" name="password" required />

          <button type="submit" className="login-button">Se Connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
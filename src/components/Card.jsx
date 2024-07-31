import React from 'react';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.css'; 


function Card( { imageSrc, text, price }) {
    return (
        <div className="card">
        <img src={imageSrc} alt="Produit" className="card-image" />
        <div className="card-content">
          <p className="card-text">{text}</p>
          <div className="card-footer">
            <span className="card-price">{price}</span>
            <button className="card-button"> <i className="fas fa-eye"></i></button>
          </div>
        </div>
      </div>
    );
}

export default Card;


 

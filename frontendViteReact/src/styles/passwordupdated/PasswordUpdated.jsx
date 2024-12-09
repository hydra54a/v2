import React from 'react';
import './PasswordUpdated.css'; 
import icon2 from "../../assets/icon2.png"; 
import { useNavigate } from 'react-router-dom';

const PasswordUpdated = () => {
  const navigate = useNavigate();

  return (
    <div className="password-updated-page">
      <div className="password-updated-container">
        <div className="password-updated-content">
          <img
            src={icon2}
            alt="Close"
            className="close-icon"
            onClick={() => navigate('/login')}
          />
          <h1>Password Updated!</h1>
          <p>Your password has been successfully changed.</p>
          <button className="login-button" onClick={() => navigate('/login')}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdated;

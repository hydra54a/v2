import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './assets/logo.png'; 
import './styles/Signup.css'; // Keep the specific styles here

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="signup-container">
        <header className="dashboard-header">
          <div
            className="logo-container"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <img src={logo} alt="b.combs logo" className="logo" />
          </div>
          <nav className="nav-links">
            <a href="#who-we-serve">Who We Serve</a>
            <a href="#our-services">Our Services</a>
            <a href="#getting-started">Getting Started</a>
            <a href="#about-us">About Us</a>
          </nav>
          <div className="auth-buttons">
            <Link to="/login">
              <button className="btn login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn signup">Sign Up</button>
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
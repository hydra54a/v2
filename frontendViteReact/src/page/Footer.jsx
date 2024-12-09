import React from 'react';
import '../styles/Footer.css';
import footerLogo from '../assets/logo.png'; 

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-logo">
        <img src={footerLogo} alt="b.combs logo" />
      </div>
      <div className="footer-links">
        <a href="/user-agreement">User Agreement</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/community-guidelines">Community Guidelines</a>
        <a href="/cookie-policy">Cookie Policy</a>
        <a href="/copyright-policy">Copyright Policy</a>
        <a href="/send-feedback">Send Feedback</a>
        <div className="language-selector">
          <select>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Footer;

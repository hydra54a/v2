// DashboardHeader.jsx
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/dashboard-header.css';
import logo from '../assets/logo.png';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      {/* Left: Logo */}
      <div className="dashboard-header-logo-container">
        <Link to="/dashboard">
          <img
            src={logo}
            alt="Company Logo"
            className="dashboard-header-company-logo"
          />
        </Link>
      </div>

      {/* Middle: Search Bar */}
      <div className="dashboard-header-search-container">
        <div className="dashboard-header-search-wrapper">
          <Search className="dashboard-header-search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="dashboard-header-search-input"
          />
        </div>
      </div>

      {/* Right: User Section */}
      <div className="dashboard-header-user-section">
        <button className="dashboard-header-customize-button">
          Customize
        </button>
        <button className="dashboard-header-icon-button">
          <Bell />
        </button>
        <div className="dashboard-header-user-profile">
          <button className="dashboard-header-icon-button">
            <User />
          </button>
          <button className="dashboard-header-icon-button">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 
                   1 0 111.414 1.414l-4 4a1 1 0 
                   01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

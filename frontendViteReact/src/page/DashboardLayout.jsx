// DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './dashboard-header';
import DashboardSidebar from './dashboard-sidebar';
import '../styles/dashboard-layout.css'; // Make sure this CSS file exists

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardHeader /> {/* Persistent Header */}
      <div className="dashboard-container">
        <DashboardSidebar /> {/* Persistent Sidebar */}
        <main className="dashboard-main">
          <Outlet /> {/* Main content changes here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;


// dashboard.jsx
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [organization, setOrganization] = useState('Loading Organization...'); // Default loading text
  const [orgId, setOrgId] = useState(localStorage.getItem("orgId")); // Fetch orgId initially from localStorage

  useEffect(() => {
    const userId = user?.user?.id;
    if (userId && !orgId) {
      // Fetch organization ID if not already in localStorage
      fetch(`http://localhost:5001/account/get-organization-by-user/${userId}`)
        .then(response => response.json())
        .then(data => {
          const fetchedOrgId = data.organization[0].id;
          localStorage.setItem("orgId", JSON.stringify(fetchedOrgId));
          setOrgId(fetchedOrgId); // Update orgId in state
        })
        .catch(error => console.error('Error fetching organization:', error));
    }
  }, [user, orgId]);

  useEffect(() => {
    if (orgId) {
      // Fetch organization details once orgId is available
      fetch(`http://localhost:5001/account/get-organization-details-by-id/${orgId}`)
        .then(response => response.json())
        .then(data => {
          setOrganization(data.organization.name); // Update organization name
        })
        .catch(error => console.error('Error fetching organization:', error));
    }
  }, [orgId]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="flex flex-col items-start">
          <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '5px' }}>
  {user?.user?.firstname} {user?.user?.lastname}
</h2>
<h2 style={{ fontWeight: 'normal', fontSize: '0.6rem', color: '#555' }}>
  {organization || 'Loading Organization...'}
</h2>          </div>
        </div>
        
      </aside>

      <div className="main-content">
        <div className="header">
          <h1>Dashboard</h1>
          <p>Your overview of donations, volunteers, and ongoing campaigns.</p>
        </div>

        {/* Big Picture Section */}
        <div className="big-picture">
          <div className="overview-card">
            <h2>Non-Profit Impact</h2>
            <div className="card">
              <i className="icon-donation"></i>
              <p>Total Donations</p>
              <h2>$5.2M</h2>
              <p>Up 20% from last year</p>
            </div>
            <div className="card">
              <i className="icon-volunteer"></i>
              <p>Volunteers</p>
              <h2>1,500+</h2>
              <p>Increased by 15% this year</p>
            </div>
            <div className="card">
              <i className="icon-campaign"></i>
              <p>Active Campaigns</p>
              <h2>12</h2>
              <p>Supporting various causes</p>
            </div>
          </div>
        </div>

        <div className="grid-container">
          <div className="work-in-progress-label">
            <h1>Work in Progress</h1>
            <p>Metrics and charts will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

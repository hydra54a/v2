import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Mail,
  CheckSquare,
  Bell,
  Users,
  BarChart2,
  Settings,
  MessageSquare,
  PlusSquare,
  LogOut,
  ChevronRight,
  Briefcase,
  FileText,
  PieChart,
  MoveLeft,
  MoveRight,
  UserPlus,
  Contact,
  CircleUser,
} from 'lucide-react';
import axios from 'axios';
import '../styles/dashboard-sidebar.css';

const DashboardSidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));

  const [isExpanded, setIsExpanded] = useState(true);
  const [isManagementExpanded, setIsManagementExpanded] = useState(false);
  const [isAttendanceExpanded, setIsAttendanceExpanded] = useState(false); // New state for Attendance submenu
  const navigate = useNavigate();

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleManagement = () => setIsManagementExpanded(!isManagementExpanded);
  const toggleAttendance = () => setIsAttendanceExpanded(!isAttendanceExpanded);

  const handleHomeClick = () => {
    
    navigate('/dashboard');
  };



  const handleAttendanceClick = () => {
    
    setIsAttendanceExpanded(!isAttendanceExpanded); // Toggle Attendance submenu on click
  };

  const handleAttendanceSummaryClick = () => {
    
    navigate('/dashboard/attendance-group');
  };

  const handleAttendanceInputClick = () => {
    
    navigate('/dashboard/attendance');
  };

  const handleAttendanceViewClick = () => {
    
    navigate('/dashboard/attendance/view');
  };

  const handleFormtempleteClick = async () => {
     // Debug log


    navigate('/dashboard/FormTemplates');
  }

  const handleUsersClick = () => {
    
    navigate('/dashboard/users');
  };

  const handleUserManagementClick = () => {
    
    navigate('/dashboard/user-management');
  };

  return (
    <div className={`dashboard-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* User Profile Section */}
      <div className="dashboard-sidebar-nav-section">
        <div className="dashboard-sidebar-nav-item" onClick={toggleSidebar}>
          {isExpanded ? (
            <>
              {/* <img 
                src="/placeholder-avatar.png" 
                alt="Brian Combs" 
                className="dashboard-sidebar-profile-avatar"
              /> */}
              <CircleUser className="dashboard-sidebar-profile-avatar" />
              <div className="dashboard-sidebar-profile-info">
                <span className="dashboard-sidebar-profile-name">{user.user.firstname} {user.user.lastname}</span>
                <span className="dashboard-sidebar-profile-email">{localStorage.getItem("email")}</span>
              </div>
              <MoveLeft className="dashboard-sidebar-arrow" />
            </>
          ) : (
            <MoveRight className="dashboard-sidebar-arrow" />
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="dashboard-sidebar-nav">
        <ul className="dashboard-sidebar-nav-list">
          <li className="dashboard-sidebar-nav-item" onClick={handleHomeClick}>
            <Home size={24} />
            {isExpanded && <span>Home</span>}
          </li>
          <li className="dashboard-sidebar-nav-item">
            <Calendar size={24} />
            {isExpanded && <span>Calendar</span>}
          </li>
          <li className="dashboard-sidebar-nav-item">
            <Mail size={24} />
            {isExpanded && <span>Messages</span>}
            {/* <span className="dashboard-sidebar-notification-badge"></span> */}
          </li>
          <li className="dashboard-sidebar-nav-item">
            <CheckSquare size={24} />
            {isExpanded && <span>Tasks</span>}
          </li>
          <li className="dashboard-sidebar-nav-item">
            <Bell size={24} />
            {isExpanded && <span>Notifications</span>}
            {/* <span className="dashboard-sidebar-notification-badge"></span> */}
          </li>
          <li className="dashboard-sidebar-nav-item" onClick={handleUsersClick}>
            <Users size={24} />
            {isExpanded && <span>Users</span>}
          </li>

          {/* Management Section */}
          <li className="dashboard-sidebar-nav-section">
            <div className="dashboard-sidebar-nav-item" onClick={toggleManagement}>
              <BarChart2 size={24} />
              {isExpanded && (
                <>
                  <span>Management</span>
                  <ChevronRight className={`dashboard-sidebar-arrow ${isManagementExpanded ? 'rotated' : ''}`} />
                </>
              )}
            </div>
            {isManagementExpanded && isExpanded && (
              <ul className="dashboard-sidebar-submenu">
                
                <li className="dashboard-sidebar-nav-item" onClick={handleUserManagementClick}>
                  <Contact size={24} />
                  <span>User-Management</span>
                </li>
                <li className="dashboard-sidebar-nav-item">
                  <Briefcase size={24} />
                  <span>Organization</span>
                </li>
                <li className="dashboard-sidebar-nav-item" onClick={handleFormtempleteClick}>
                  <FileText size={24} />
                  <span>Form Templates</span>
                </li>
                <li className="dashboard-sidebar-nav-item">
                  <FileText size={24} />
                  <span>Programs</span>
                </li>
                <li className="dashboard-sidebar-nav-item">
                  <PieChart size={24} />
                  <span>Reports</span>
                </li>
                <li className="dashboard-sidebar-nav-item" onClick={handleAttendanceClick}>
                  <UserPlus size={24} />
                  <span>Attendance</span>
                  <ChevronRight className={`dashboard-sidebar-arrow ${isAttendanceExpanded ? 'rotated' : ''}`} />
                </li>
                {isAttendanceExpanded && (
                  <ul className="dashboard-sidebar-submenu">
                    <li className="dashboard-sidebar-nav-item" onClick={handleAttendanceSummaryClick}>
                      <span>Attendance Summary</span>
                    </li>
                    <li className="dashboard-sidebar-nav-item" onClick={handleAttendanceInputClick}>
                      <span>Attendance Input</span>
                    </li>
                    <li className="dashboard-sidebar-nav-item" onClick={handleAttendanceViewClick}>
                      <span>Attendance View</span>
                    </li>
                  </ul>
                )}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="dashboard-sidebar-footer">
        <ul className="dashboard-sidebar-nav-list">
          <li className="dashboard-sidebar-nav-item">
            <Settings size={24} />
            {isExpanded && <span>Settings</span>}
          </li>
          <li className="dashboard-sidebar-nav-item">
            <MessageSquare size={24} />
            {isExpanded && <span>My Application</span>}
          </li>
          <li className="dashboard-sidebar-nav-item" onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
            <LogOut size={24} />
            {isExpanded && <span>Sign Out</span>}
          </li>
          <li className="dashboard-sidebar-nav-item">
            <PlusSquare size={24} />
            {isExpanded && <span>Refer</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardSidebar;

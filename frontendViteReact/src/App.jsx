import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './page/Footer';
import LandingPage from './page/landingPage';
import Login from './page/Login';
import SignupForm from './page/SignupForm';
import AccountChoice from './page/create-account';
import OrganizationInfoForm from './page/organization-info-form';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './styles/ResetPassword';
import SetNewPassword from './styles/setnewpassword/SetNewPassword';
import PasswordUpdated from './styles/passwordupdated/PasswordUpdated';
import GroupsPage from './page/groupsPage';
import DashboardLayout from './page/DashboardLayout';
import Dashboard from './page/dashboard';


import ExamplePage from './page/ExamplePage'; 
import Attendance from './page/Attendance'; 
import AttendanceGroups from './page/AttendanceGroups'; 
import FormBuilder from './page/FormBuilder'; 

import FormEditor from './page/FormEditor'; 

import FormTemplatesPage from './page/FormTemplatesPage';
import UserManagement from './page/UserManagement'; 
import AttendanceEventCreate from './page/AttendanceEventCreate';



function App() {
  return (
    <>
      <Routes>
        {/* Public Routes with Header and Footer */}
        <Route element={<><Header /><Outlet /></>}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signup2" element={<AccountChoice />} />
          <Route path="/accountchoice" element={<AccountChoice />} />
          <Route path="/orginfo" element={<OrganizationInfoForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/password-updated" element={<PasswordUpdated />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default Dashboard Page */}
          <Route index element={<Dashboard />} />
          {/* Example Page for Home Icon Click */}
          <Route path="home" element={<ExamplePage />} />

          {/* Attendance Page Route */}
          <Route path="attendance" element={<Attendance />} />
          {/* Add other dashboard routes here */}
          <Route path="attendance-group" element={<AttendanceGroups />} />

          {/* New Attendance Event Creation Route */}
          <Route path="attendance-detail/:id" element={<AttendanceEventCreate />} />

          

          
          {/* Add other dashboard routes here */}
          <Route path="FormTemplates" element={<FormTemplatesPage />} />
          <Route path="form-generator" element={<FormBuilder />} />
          <Route path="form-editor" element={<FormEditor />} />
          <Route path="users" element={<GroupsPage />} />



          <Route path="user-management" element={<UserManagement />} />

        </Route>
      </Routes>
      <Footer />  
    </>
  );
}

export default App;


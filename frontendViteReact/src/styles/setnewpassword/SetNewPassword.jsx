import React, { useState, useEffect } from 'react';
import './SetNewPassword.css';
import icon2 from "../../assets/icon2.png"; 
import { useNavigate } from 'react-router-dom';

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); 
  const navigate = useNavigate();

  // Fetch CSRF token when the component loads
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:5001/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken); 
      } catch (error) {
        setError('Failed to fetch CSRF token.');
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    const resetToken = localStorage.getItem('reset_token'); // Get token from localStorage
     

    if (!resetToken) {
      setError('Reset token is missing. Please retry the password reset process.');
      return;
    }
    
    try {
        const response = await fetch('http://localhost:5001/password/set-new-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ newPassword, resetToken }),
            credentials: 'include',
          });
    
  
      const data = await response.json();
      if (response.ok) {
        setSuccess('Password has been updated successfully!');
        setTimeout(() => {
          navigate('/password-updated'); 
        }, 3000); 
      } else {
        setError(data.message || 'Failed to update password.');
      }
    } catch (error) {
      setError('An error occurred while updating the password.');
    }
  };
  
  return (
    <div className="set-new-password-page">
      <div className="set-new-password-container">
        <div className="set-new-password-content">
          <img
            src={icon2}
            alt="Close"
            className="close-icon"
            onClick={() => navigate('/login')}
          />
          <h1>Set New Password</h1>
          <p>Your password must be different from your previously used password.</p>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
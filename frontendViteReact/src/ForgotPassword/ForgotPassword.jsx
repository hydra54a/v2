import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import icon2 from '../assets/icon2.png'; 
import { useNavigate } from 'react-router-dom'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); 

  const navigate = useNavigate(); // Create navigate function

  // Fetch the CSRF token when the component loads
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:5001/csrf-token', {
          credentials: 'include', // Include cookies
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Store CSRF token in state
      } catch (error) {
        setError('Failed to fetch CSRF token.');
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clear any previous errors
    setError('');
  
    // Validate that email is entered and phone is empty
    if (!email || phone) {
      setError('Please enter a valid email address.');
      return;
    }
  
    try {
      // Send a request to the backend with the email and CSRF token
      const response = await fetch('http://localhost:5001/password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken, // Include the CSRF token in the request headers
        },
        credentials: 'include', // Ensure cookies (CSRF token in cookie) are sent with the request
        body: JSON.stringify({ email }), // Send the email in the body
      });
  
      const data = await response.json();
      if (response.ok) {
        // Store the email in localStorage
        localStorage.setItem('email', email);
  
        // If the response is okay, navigate to the reset password page
        setSuccess('Password reset email sent. Please check your email.');
        navigate('/reset-password'); // Navigate to ResetPassword page
      } else {
        setError(data.message || 'Something went wrong, please try again.');
      }
    } catch (err) {
      setError('Error occurred while sending the email. Please try again.');
    }
  };
  

  // Handle the click event for the close icon to navigate back to the login page
  const handleCloseClick = () => {
    navigate('/login'); 
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <img
            src={icon2}
            alt="Close"
            className="close-icon"
            onClick={handleCloseClick} // Add onClick handler
          />
          <h1>Forgot Password?</h1>
          <p>No worries, we’ll send you instructions to reset your password.</p>
          
          {/* Display an error message if there's an issue */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brian.combs@gmail.com"
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

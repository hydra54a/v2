import React, { useState, useEffect } from 'react';
import "../styles/Login.css";
import loginInfoImg from '../assets/login_info.png';
import { useNavigate } from "react-router-dom"; // Import useNavigate



const Login = () => {
  // State variables for form fields, messages, and CSRF token
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  const navigate = useNavigate(); // Correctly call the useNavigate hook
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
        setError('Failed to fetch CSRF token');
      }
    };
  
    fetchCsrfToken();
  }, []);  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload to send to the backend (update the casing)
    const payload = {
      email: email.trim(), 
      password: password.trim(), 
    };

    try {
      // Make a POST request to the backend
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken, // Include the CSRF token in the request headers
        },
        credentials: 'include', // Ensure cookies (CSRF token in cookie) are sent with the request
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login, save token
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('token', data.token); // Store JWT token for future authenticated requests
        // Optionally, redirect the user
        // window.location.href = '/dashboard';
        const user = await fetch(`http://localhost:5001/account/get-user-details?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken, // Include the CSRF token in the request headers
          },
          credentials: 'include', 
        });
        
        const userData = await user.json(); // Parse the JSON response
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('email', email);
        navigate("/dashboard")

      } else {
        // Handle login failure
        setError(data.msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      
      // Handle network or other errors
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1>Welcome to b.combs</h1>
          <div className="user-type">
            <label>
              <input
                type="radio"
                name="userType"
                value="individual"
              /> Individual
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="organization"
              /> Organization
            </label>
          </div>

          {/* Error and Success Messages */}
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
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="remember-forgot-container">
              <label className="remember-signin">
                <input type="checkbox" /> Remember sign-in details
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          <div className="signup-prompt">
            <span>
              Don’t have an account? <a href="/signup">Sign Up</a>
            </span>
          </div>
          <div className="social-signin">
            <p>Or, sign in with</p>
            <div className="social-icons">
              {/* Add social icons here */}
            </div>
          </div>
        </div>
        <div className="login-right">
          <img src={loginInfoImg} alt="Login Information" />
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import './ResetPassword.css'; 
import { useNavigate } from 'react-router-dom';
import icon3 from '../assets/Icon3.png'; 

const ResetPassword = () => {
  const [code, setCode] = useState(new Array(6).fill('')); // 6 boxes for the code
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // CSRF token state
  const navigate = useNavigate();

  // Fetch CSRF token when the component loads
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:5001/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Store CSRF token
      } catch (error) {
        setError('Failed to fetch CSRF token.');
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value)) return; // Only allow numeric input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically move to next input field
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = code.join(''); // Combine array into a single string
    
    try {
      const response = await fetch('http://localhost:5001/password/verify-reset-code',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken, // Include CSRF token in the headers
        },
        body: JSON.stringify({ code: enteredCode }),
        credentials: 'include', // Ensure cookies are included for CSRF protection
      });
  
      const data = await response.json();
        // Log the entire response to check if resetToken is being returned
      
      if (response.ok) {
         // Log the reset token
        localStorage.setItem('reset_token', data.resetToken);  // Save token in localStorage with consistent key
        setSuccess('Code verified! Redirecting to set new password...');
        setTimeout(() => {
          navigate('/set-new-password'); // Navigate to the next page to set a new password
        }, 1500); // Wait for 1.5 seconds before redirecting
      } else {
        setError(data.message || 'Invalid code. Please try again.');
      }   
    } catch (error) {
      setError('An error occurred while verifying the code.');
    }
  };

  

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <img src={icon3} alt="Checkmark Icon" className="checkmark-icon" /> 
        <h1>Please check your email</h1>
        <p>Enter the 6-digit code sent to your email address</p>

        {/* Display an error message if there's an issue */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                id={`code-input-${idx}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, idx)}
              />
            ))}
          </div>

          <div className="button-group">
            <button type="submit" className="continue-button">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect } from "react";
import "../styles/create-account.css"; // Import the CSS file
import { useNavigate,useLocation } from "react-router-dom"; // Import useNavigate

const AccountChoice = () => {
  const [showCodeInput, setShowCodeInput] = useState(false); // State to control input visibility
  const [code, setCode] = useState(""); // State to store the inputted code
  const [csrfToken, setCsrfToken] = useState("");// State to store the userId
  const navigate = useNavigate(); // Correctly call the useNavigate hook
  const location = useLocation();
  const [userId, setUserId] = useState(useLocation().state?.userId);
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost:5001/csrf-token", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Store CSRF token in state
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        setErrorMessage("Failed to load CSRF token. Please refresh.");
      }
    };

    fetchCsrfToken();
  }, []);
  // Toggle the input box visibility
  const handleToggleCodeInput = () => {
    setShowCodeInput((prev) => !prev); // Toggle the state between true and false
  };

  const handleSubmitNoCode = async(event) => {
    navigate("/ "); // Navigate to the landing page

    try {
      // Send a POST request to the backend with the form data
      const response = await fetch("http://localhost:5001/account/create-account-without-code", {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Send the CSRF token in the header
        },
        body: JSON.stringify({
          userId: userId, // Include the userId in the body // Include the code in the body
        }),
      });
  
      const data = await response.json();
  
      // Log the server's response
      
  
      navigate("/ "); // Navigate to the landing page
  
      
    } catch (error) {
      console.error("Error sending data:", error);
      setErrorMessage("An error occurred during account creation.");
    }
  }

  const handleSubmitCode = async(event)=> {
        event.preventDefault(); // Prevent page refresh on form submission
    try {
      // Send a POST request to the backend with the form data
      const response = await fetch("http://localhost:5001/account/join-organization", {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
           "X-CSRF-Token": csrfToken, // Send the CSRF token in the header
        },
        body: JSON.stringify({
          userId: userId, // Include the userId in the body
          organizationCode: code, // Include the code in the body
        }),
      });
      
      const data = await response.json();
      
      // Log the server's response
      
      navigate("/ "); // Navigate to the landing page
  
  
    } catch (error) {
      console.error("Error sending data:", error);
      setErrorMessage("An error occurred during account creation.");
    }
  };

  return (
    <div className="account-choice-container">
      <div className="account-options">
        <div className="option-card">
          <img
            src="/individual.png" // Replace with the path to your image
            alt="Individual"
            className="option-image"
          />
          <h2>Individual</h2>
          <p>I need to create an account for myself or my child.</p>
          <button className="option-button" onClick={handleToggleCodeInput}>
            {showCodeInput ? "I have a code" : "I have a code"}
          </button>
          {showCodeInput && (
            <div className="code-input-container">
              <input
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="code-input"
              />
              <button className="submit-button" onClick={handleSubmitCode}>
                Submit
              </button>
            </div>
          )}
          <button className="secondary-button"  onClick={handleSubmitNoCode}>I do not have a code</button>
        </div>
        <div className="option-card">
          <img
            src="/organization.png" // Replace with the path to your image
            alt="Organization"
            className="option-image"
          />
          <h2>Organization</h2>
          <p>
            I need to create an account for a school, organization, or nonprofit.
          </p>
          <div className="option-buttons">
            <button
              className="option-button"
              onClick={() => navigate("/orginfo", { state: { userId: userId } })}
            >
              Create Account
            </button>
            <button className="secondary-button" onClick={() => navigate("/login")}>Log In</button>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default AccountChoice;

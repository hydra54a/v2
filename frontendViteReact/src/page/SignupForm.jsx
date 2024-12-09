import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignupForm.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch CSRF token when component mounts
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

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh on form submission

    const newUser = {
      firstname,
      lastname,
      email,
      password,
    };

    try {
      // Send a POST request to the backend with the form data
      const response = await fetch("http://localhost:5001/account/create-account", {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Send the CSRF token in the header
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      // Log the server's response
      

      // Reset form fields if successful
      if (response.ok) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setErrorMessage(""); // Clear any error messages
        navigate("/accountchoice",  { state: { userId: data.userId } }); // Redirect to account choice
      } else {
        setErrorMessage(data.error || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setErrorMessage("An error occurred during account creation.");
    }
  };

  return (
    <>
      <div className="signup-form">
        <h2>Create Account</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            First Name
            <input
              type="text"
              placeholder="Brian"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              placeholder="Combs"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              placeholder="brian.combs@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Create Password
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        {/* <p>Or, sign up with</p>
        <div className="social-signup">
          <button>Google</button>
          <button>Facebook</button>
          <button>Twitter</button>
        </div> */}
        <p>
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </>
  );
};

export default SignupForm;

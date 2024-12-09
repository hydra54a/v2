import React, { useState, useEffect } from "react";
import '../styles/organization-info-form.css'; // Add the CSS here
import { useNavigate,useLocation } from "react-router-dom"; // Import useNavigate

const OrganizationInfoForm = () => {
  const navigate = useNavigate(); // Correctly call the useNavigate hook
  const [userId, setUserId] = useState(useLocation().state?.userId);
  // State for form data
  const [formData, setFormData] = useState({
    userId:  userId |"",
    organizationName: "",
    organizationType: "",
    industry: "",
    roleInCompany: "",
    phoneNumber: "",
    primaryAddress: "",
    audience: "",
    painPoints: "",
    startingPoint: "",
    responsibilities: "",
    goals: [],
  });
  
  const [step, setStep] = useState(1); // State for navigation
  const [csrfToken, setCsrfToken] = useState(""); // State for CSRF token
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const location = useLocation();
  

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox selection for goals
  const handleGoalChange = (goal) => {
    const updatedGoals = formData.goals.includes(goal)
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal];
    setFormData({ ...formData, goals: updatedGoals });
  };

  // Go to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Go to the previous step
  const previousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    

    navigate("/signup");

    try {
      // Make a POST request to your backend
      const response = await fetch("http://localhost:5001/account/complete-organization-setup", {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Send the CSRF token in the header
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      

      if (response.ok) {
        navigate("/login"); // Navigate to account choice on success
      } else {
        setErrorMessage(data.error || "Failed to submit organization details.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred during submission.");
    }
  };

  return (
    <div className="form-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {step === 1 && (
        <div className="form-step">
          <h2>Tell us a little bit more</h2>
          <input
            type="text"
            placeholder="Organization Name"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
          />
        <select
  name="organizationType"
  value={formData.organizationType}
  onChange={(e) =>
    setFormData({
      ...formData,
      organizationType: e.target.value,
    })
  }
>
  <option value="">Select an option</option>
  <option value="1">Corporation</option>
  <option value="2">Educational Institution</option>
  <option value="3">Government Agency</option>
  <option value="4">Non-Profit</option>
  <option value="5">Small Business</option>
</select>


          <input
            type="text"
            placeholder="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Role in Company"
            name="roleInCompany"
            value={formData.roleInCompany}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Primary Address"
            name="primaryAddress"
            value={formData.primaryAddress}
            onChange={handleChange}
          />
          <div className="form-navigation">
            <button onClick={() => navigate("/accountchoice")}>Previous</button>
            <button onClick={nextStep}>Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <h2>How can we help?</h2>
          <select
            name="audience"
            value={formData.audience}
            onChange={handleChange}
          >
            <option value="">Who is your audience?</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="parents">Parents</option>
            <option value="community">Community</option>
          </select>

          <select
            name="painPoints"
            value={formData.painPoints}
            onChange={handleChange}
          >
            <option value="">What are your pain points?</option>
            <option value="engagement">Engagement</option>
            <option value="resources">Resources</option>
            <option value="communication">Communication</option>
            <option value="data-management">Data Management</option>
          </select>

          <select
            name="startingPoint"
            value={formData.startingPoint}
            onChange={handleChange}
          >
            <option value="">Where do you want to get started?</option>
            <option value="planning">Planning</option>
            <option value="execution">Execution</option>
            <option value="evaluation">Evaluation</option>
          </select>

          <select
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
          >
            <option value="">What are your responsibilities?</option>
            <option value="management">Management</option>
            <option value="strategy">Strategy</option>
            <option value="operations">Operations</option>
          </select>

          <div className="form-navigation">
            <button onClick={previousStep}>Previous</button>
            <button onClick={nextStep}>Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h2>What's the game plan?</h2>
          <div className="goal-options">
            <div className="goal">
              <img src="metrics.png" alt="Track Metrics" />
              <label>
                <input
                  type="checkbox"
                  checked={formData.goals.includes("Track Metrics")}
                  onChange={() => handleGoalChange("Track Metrics")}
                />
                Track Metrics
              </label>
              <div className="text"> What do you want to accomplish with BCombs?</div>
            </div>
            <div className="goal">
              <img src="create.png" alt="Create Events" />
              <label>
                <input
                  type="checkbox"
                  checked={formData.goals.includes("Create Events")}
                  onChange={() => handleGoalChange("Create Events")}
                />
                Create Events
              </label>
              <div className="text"> What do you want to accomplish with BCombs?</div>
            </div>
            <div className="goal">
              <img src="outreach.png" alt="Outreach" />
              <label>
                <input
                  type="checkbox"
                  checked={formData.goals.includes("Outreach")}
                  onChange={() => handleGoalChange("Outreach")}
                />
                Outreach
              </label>
              <div className="text"> What do you want to accomplish with BCombs?</div>
            </div>
            <div className="goal">
              <img src="data.png" alt="data-aggregation" />
              <label>
                <input
                  type="checkbox"
                  checked={formData.goals.includes("data-aggregation")}
                  onChange={() => handleGoalChange("data-aggregation")}
                />
                Data Aggregation
              </label>
              <div className="text"> What do you want to accomplish with BCombs?</div>
            </div>
            <div className="goal">
              <img src="automate.png" alt="Automate Processes" />
              <label>
                <input
                  type="checkbox"
                  checked={formData.goals.includes("Automate Processes")}
                  onChange={() => handleGoalChange("Automate Processes")}
                />
                Automate Processes
              </label>
              <div className="text"> What do you want to accomplish with BCombs?</div>
            </div>
            <div className="goal">
              <img src="student.png" alt="Student Centered" />
              <label>
                <input
                  type="checkbox"
                  checked={formData.goals.includes("Student Centered")}
                  onChange={() => handleGoalChange("Student Centered")}
                />
                Student Centered
              </label>
              <div className="text"> What do you want to accomplish with BCombs?</div>
            </div>
          </div>
          <div className="form-navigation">
            <button onClick={previousStep}>Previous</button>
            <button onClick={handleSubmit}>Create Account</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationInfoForm;


const { loginUser } = require('../services/authService');

// Controller function to handle login requests
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Attempt to login the user and get a token
    const { token } = await loginUser(email, password);
    res.json({ token }); // Send the token back in the response
  } catch (err) {
    res.status(400).json({ msg: err.message }); // Handle errors by sending a 400 status with the error message
  }
}

// Function to fetch CSRF token
function getCsrfToken(req, res) {
  const csrfToken = req.csrfToken(); // Fetch CSRF token from middleware
  res.json({ csrfToken }); // Send the token in the response
}

module.exports = {
  login,
  getCsrfToken,
};

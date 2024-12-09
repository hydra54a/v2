
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const config = require("./config"); 
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");  
const passwordResetRoutes = require("./routes/passwordResetRoutes"); 
const createAccountRoutes = require('./routes/createAcc');
const groupRoutes = require('./routes/groupRoutes');
const formRoutes = require('./routes/FormRoutes');
const attendanceGroupRoutes = require('./routes/attendanceGroupRoutes');



const app = express();
const port = config.port || 5001;

// Middleware setup
app.use(helmet()); // Secure HTTP headers

// CORS Configuration
app.use(cors({

  origin: 'http://localhost:5173', 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization,CSRF-Token,X-CSRF-Token', // Allow necessary headers, including CSRF token
  credentials: true // Allow cookies to be sent
}));

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// CSRF protection middleware
if (process.env.NODE_ENV !== 'test') {
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
}

// Route to get CSRF token
app.get("/csrf-token", (req, res) => {
    if (process.env.NODE_ENV !== 'test') {
             res.json({ csrfToken: req.csrfToken() });
           } else {
             res.json({ csrfToken: 'test-csrf-token' }); // Mock CSRF token in test environment
          }
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/password", passwordResetRoutes); // Password reset route
app.use("/search", searchRoutes); 
app.use("/account", createAccountRoutes); 
app.use('/groups', groupRoutes);
app.use('/forms', formRoutes);
app.use('/', attendanceGroupRoutes); 

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

// Start the server
if (require.main == module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); 
  });
}

module.exports = app; 
const express = require('express');
const { login, getCsrfToken } = require('../login/loginController'); 

const router = express.Router();

// CSRF Token route
router.get('/csrf-token', getCsrfToken); 

// Login route
router.post('/login', login);

module.exports = router;

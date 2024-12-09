const express = require('express');
const router = express.Router();
const FormController = require('../controllers/FormController');

// Create a form
router.post('/create', (req, res) => {
  
  FormController.createForm(req, res);
});

// Get a form by ID
router.get('/:formId', (req, res) => {
  FormController.getFormById(req, res);
});

// Get all forms
router.get('/', (req, res) => {
  FormController.getAllForms(req, res);
});

router.get('/user/:userId', (req, res) => {
  FormController.getFormsByUser(req, res);
});

// Fetch all forms associated with a specific organization
router.get('/organization/:organizationId', (req, res) => {
  FormController.getFormsByOrganization(req, res);
});
// Delete a form by ID
router.delete('/:formId', (req, res) => {
  FormController.deleteForm(req, res);
});

// Edit a form by ID
router.put('/:formId', (req, res) => {
  FormController.editForm(req, res);
});

module.exports = router;

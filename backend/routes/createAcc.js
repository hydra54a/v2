// routes/createAcc.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Create account
router.post('/create-account', (req, res) => {
  UserController.createAccount(req, res);
});

// Complete organization setup
router.post('/complete-organization-setup', (req, res) => {
  UserController.completeOrganizationSetup(req, res);
});

// Join organization
router.post('/join-organization', (req, res) => {
  UserController.joinOrganization(req, res);
});

// Join organization without code
router.post('/create-account-without-code', (req, res) => {
  UserController.joinOrganizationWithoutCode(req, res);
});

router.get('/get-user-details', (req, res) => {
  UserController.getUserDetailsByEmail(req, res);
});


router.get('/get-organization-by-user/:userId', (req, res) => {
  UserController.getOrganizationByUser(req, res);
});

router.get('/get-user-details-by-id/:userId', (req, res) => {
  UserController.getUserDetailsById(req, res);
});

router.get('/get-organization-details-by-id/:orgId', (req, res) => {
  UserController.getOrganizationDetailsById(req, res);
});

router.get('/organizations/:organizationId/users', (req, res) => {
  UserController.getOrganizationUsers(req, res);
});

router.post('/invite-user', (req, res) => {
  UserController.inviteUser(req, res); // Ensure instance method usage
});


router.put('/update-user-role', (req, res) => {
  UserController.updateUserRole(req, res);
});

// Delete user
router.delete('/delete-user/:userId', (req, res) => {
  UserController.deleteUser(req, res);
});

// Get Organization ID by User ID
router.get('/user/:userId/organization', (req, res) => {
  UserController.getOrganizationByUserId(req, res);

});

module.exports = router;

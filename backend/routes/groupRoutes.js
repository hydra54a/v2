const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();

// Use JWT verification for secure routes
router.get('/allGroups', groupController.getAllGroups);
router.get('/allEmails/:organizationId', groupController.getAllGroupEmails);
router.get('/:organizationId', groupController.getGroupDetailsByOrgId);
router.post('/create', groupController.createOrUpdateGroup);
router.post('/emails', groupController.addUsersToGroup);
router.delete('/delete/:id', groupController.deleteGroupById);

module.exports = router;

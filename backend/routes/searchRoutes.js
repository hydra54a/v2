const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController.js');

// define route for getting events
router.get('/events', searchController.getEvents);
router.post('/event-types', searchController.getEventTypes);

module.exports = router;
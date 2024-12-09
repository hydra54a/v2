const express = require('express');
const router = express.Router();
const {
  getEventAttendanceDetails,
  getEventStudents,
  startEventAttendance,
  saveEventAttendance
} = require('../controllers/attendanceController');

// Route to get event attendance details
router.get('/attendance/:id', getEventAttendanceDetails);

// Update this route to make it simpler without requiring an organization ID parameter
router.get('/attendance/students', getEventStudents);

// Route to start a new attendance event
router.post('/attendance-event/start', startEventAttendance);

// Route to save attendance data for an event
router.post('/attendance-event/save', saveEventAttendance);

module.exports = router;
const express = require('express');
const attendanceGroupService = require('../services/attendanceGroupService');

const router = express.Router();

// Endpoint to get all attendance groups
router.get('/attendance-groups', async (req, res) => {
    try {
        
        const groups = await attendanceGroupService.getAllAttendanceGroups();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error occurred in /attendance-groups route:', error.message);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;

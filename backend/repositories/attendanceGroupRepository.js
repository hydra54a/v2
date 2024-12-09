const getKnex = require('../db/getKnex');

// Get all attendance group details with form_type 'Attendance'
async function getAllAttendanceGroups() {
    const knex = getKnex();
    try {
        // Fetch all attendance groups with 'Attendance' type
        const groups = await knex('OrganizationGroups')
            .where('form_type', 'Attendance') // Filter for attendance groups
            .select('id', 'name', 'subgroups', 'user_emails'); // Fetch necessary fields
        
         // Debugging line to check the returned data
        return groups;
    } catch (err) {
        console.error('Error fetching attendance groups:', err);
        throw err;
    }
}

module.exports = {
    getAllAttendanceGroups
};

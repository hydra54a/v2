const AttendanceGroupRepository = require('../repositories/attendanceGroupRepository');

// Fetch all attendance groups with 'Attendance' form type
async function getAllAttendanceGroups() {
    try {
        
        
        // Fetch all attendance groups from the repository
        const groups = await AttendanceGroupRepository.getAllAttendanceGroups();

        

        // Format the response to include total members by counting emails
        return groups.map(group => ({
            id: group.id,
            groupName: group.name,
            subGroup: group.subgroups,
            totalMembers: group.user_emails ? group.user_emails.split(',').length : 0
        }));
    } catch (err) {
        console.error('Error fetching attendance groups:', err.message);
        throw new Error('Error fetching attendance groups: ' + err.message);
    }
}



module.exports = {
    getAllAttendanceGroups
};

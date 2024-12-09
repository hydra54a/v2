const knex = require('../db/getKnex');

const getEventAttendance = async (eventId) => {
  try {
    const attendanceDetails = await knex('EventsAttendance')
      .select('*')
      .where('event_id', eventId);
    return attendanceDetails;
  } catch (error) {
    throw new Error('Error fetching attendance details');
  }
};

const getStudentsForOrganization = async () => {
  try {
    // Step 1: Get user_emails for attendance groups with form_type 'Attendance'
    const groups = await knex('OrganizationGroups')
      .select('user_emails')
      .where('form_type', 'Attendance');

    if (!groups || groups.length === 0) {
      return [];
    }

    const emails = groups.flatMap(group => 
      group.user_emails ? group.user_emails.split(',').map(email => email.trim()) : []
    );

    // Step 2: Get user_ids from Users table by matching emails
    if (emails.length === 0) {
      return [];
    }

    const users = await knex('Users')
      .select('id')
      .whereIn('email', emails);

    const userIds = users.map(user => user.id);

    if (userIds.length === 0) {
      return [];
    }

    // Step 3: Get user profiles by user_ids to fetch firstname and lastname
    const userProfiles = await knex('UserProfiles')
      .whereIn('user_id', userIds)
      .select('user_id', 'firstname', 'lastname');

    return userProfiles;
  } catch (error) {
    throw new Error('Error fetching students');
  }
};

  

module.exports = {
  getEventAttendance,
  getStudentsForOrganization,
  insertEventAttendance
};

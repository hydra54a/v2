const cleanUpIncompleteRegistrations = async () => {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() - 24); // Set expiration threshold (24 hours)
  
    try {
      const deletedUsers = await knex('Users')
        .where('registration_status', 'pending')
        .andWhere('created_at', '<', expirationTime)
        .del(); // Deletes the rows
      
    } catch (error) {
      console.error('Error cleaning up incomplete registrations:', error);
    }
  };
  
  // Schedule it with node-cron or another task runner
//   const cron = require('node-cron');
//   cron.schedule('0 0 * * *', cleanUpIncompleteRegistrations); // Runs daily at midnight
const { getEventAttendance, getStudentsForOrganization, insertEventAttendance } = require('../repositories/attendanceRepository');

const getEventAttendanceDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const eventDetails = await getEventAttendance(eventId);
    if (eventDetails.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(eventDetails);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Error fetching event details', error });
  }
};

const getEventStudents = async (req, res) => {
  try {
    const students = await getStudentsForOrganization();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

const startEventAttendance = async (req, res) => {
  try {
    const { eventId, date, startTime, endTime } = req.body;

    // Validate if the eventId exists in the Events table 
    const eventExists = await knex('Events').where('id', eventId).first();
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Insert the new row into the EventsAttendance table
    await insertEventAttendance({
      event_id: eventId,
      total_hours: 0,
      mentor_hours: 0,
      present: '',
      absent: '',
      late: '',
      date,
      start_time: startTime,
      end_time: endTime,
    });

    res.status(200).json({ message: 'Attendance record created successfully.' });
  } catch (error) {
    console.error('Error starting event attendance:', error);
    res.status(500).json({ message: 'Error starting event attendance', error });
  }
};

const saveEventAttendance = async (req, res) => {
  try {
    const { eventId, attendanceData } = req.body;

    // Iterate through the data and insert/update into the EventsAttendance table
    for (let data of attendanceData) {
      await knex('EventsAttendance')
        .where('event_id', eventId)
        .update({
          mentor_hours: data.mentorHours,
          total_hours: data.volunteerHours,
          present: data.isPresent ? 'Yes' : 'No',
          absent: data.isAbsent ? 'Yes' : 'No',
          late: data.isLate ? 'Yes' : 'No',
        });
    }

    res.status(200).json({ message: 'Attendance data saved successfully.' });
  } catch (error) {
    console.error('Error saving attendance data:', error);
    res.status(500).json({ message: 'Error saving attendance data', error });
  }
};

module.exports = {
  getEventAttendanceDetails,
  getEventStudents,
  startEventAttendance,
  saveEventAttendance,
};

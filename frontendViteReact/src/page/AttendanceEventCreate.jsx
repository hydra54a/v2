import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/AttendanceEventCreate.css';

const AttendanceEventCreate = () => {
  const { id } = useParams();
  const location = useLocation();

  // Extract group and subgroup from the state passed from AttendanceGroups
  const { groupName = 'N/A', subGroup = 'N/A' } = location.state || {};

  const [volunteerHours, setVolunteerHours] = useState(0);
  const [mentoringHours, setMentoringHours] = useState(0);

  const handleIncrement = (type) => {
    if (type === 'volunteer') {
      setVolunteerHours((prev) => prev + 1);
    } else if (type === 'mentoring') {
      setMentoringHours((prev) => prev + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === 'volunteer' && volunteerHours > 0) {
      setVolunteerHours((prev) => prev - 1);
    } else if (type === 'mentoring' && mentoringHours > 0) {
      setMentoringHours((prev) => prev - 1);
    }
  };

  const handleManualInput = (type, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      if (type === 'volunteer') {
        setVolunteerHours(numValue);
      } else if (type === 'mentoring') {
        setMentoringHours(numValue);
      }
    }
  };

  return (
    <div className="attendance-event-page">
      <h1 className="attendance-title">Attendance</h1>
      <div className="attendance-form-container">
        <div className="group-info">
          <h2>Group: {groupName}</h2>
          <label htmlFor="subgroup">Sub Group</label>
          <select id="subgroup">
            {subGroup && subGroup !== 'N/A' ? (
              subGroup.split(',').map((sub, i) => (
                <option key={i} value={sub.trim()}>
                  {sub.trim()}
                </option>
              ))
            ) : (
              <option value="N/A">N/A</option>
            )}
          </select>
        </div>

        <div className="event-details">
          <label>Event Name</label>
          <input type="text" placeholder="Enter event name" />

          <div className="date-time-container">
            <div className="date-time-input">
              <label>Date</label>
              <input type="date" />
            </div>
            <div className="date-time-input">
              <label>Start Time</label>
              <input type="time" />
            </div>
            <div className="date-time-input">
              <label>End Time</label>
              <input type="time" />
            </div>
            <div className="recurring-container">
              <label>
                <input type="checkbox" id="recurring" />
                Recurring
              </label>
            </div>
          </div>

          <label>Description</label>
          <textarea placeholder="Add a description"></textarea>
        </div>
        <button className="start-event-button">Start Event</button>
      </div>

      <div className="attendance-list-container">
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Student Name</th>
              <th>Present</th>
              <th>Late</th>
              <th>Absent</th>
              <th>Volunteer Hrs</th>
              <th>Mentoring Hrs</th>
            </tr>
          </thead>
          <tbody>
            {/* Add student list dynamically */}
            <tr>
              <td>
                <input type="checkbox" />
              </td>
              <td>Student Name</td>
              <td>
                <input type="radio" name="attendance-status" value="present" />
              </td>
              <td>
                <input type="radio" name="attendance-status" value="late" />
              </td>
              <td>
                <input type="radio" name="attendance-status" value="absent" />
              </td>
              <td>
                <div className="hours-control">
                  <button onClick={() => handleDecrement('volunteer')}>-</button>
                  <input
                    type="text"
                    value={volunteerHours}
                    onChange={(e) => handleManualInput('volunteer', e.target.value)}
                  />
                  <button onClick={() => handleIncrement('volunteer')}>+</button>
                </div>
              </td>
              <td>
                <div className="hours-control">
                  <button onClick={() => handleDecrement('mentoring')}>-</button>
                  <input
                    type="text"
                    value={mentoringHours}
                    onChange={(e) => handleManualInput('mentoring', e.target.value)}
                  />
                  <button onClick={() => handleIncrement('mentoring')}>+</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="save-button-container">
        <button className="save-button">Save Changes</button>
      </div>
    </div>
  );
};

export default AttendanceEventCreate;

import React, { useEffect, useState } from 'react';
import '../styles/AttendanceGroups.css';
import { getCsrfToken } from './groupsFunctions';
import { Link } from 'react-router-dom';

const AttendanceGroups = () => {
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const [jwt, setJwt] = useState('');
  const [error, setError] = useState('');

  // Step 1: Fetch CSRF Token and JWT Token
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { csrfVal, valid } = await getCsrfToken();
        if (valid) {
          setCsrfToken(csrfVal);
          const jwtToken = localStorage.getItem('token');
          if (jwtToken) {
            setJwt(jwtToken);
          } else {
            setError('JWT token not found. Please log in again.');
          }
        } else {
          setError(csrfVal);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setError('Error fetching CSRF token');
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchGroupsData = async () => {
      if (csrfToken && jwt) {
        try {
          console.log(
            'Fetching attendance groups data with CSRF token:',
            csrfToken,
            'and JWT:',
            jwt,
          );

          // Fetch attendance groups data from the new backend endpoint
          const response = await fetch(
            'http://localhost:5001/attendance-groups',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
                Authorization: `Bearer ${jwt}`,
              },
              credentials: 'include',
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const groupData = await response.json();
          
          setGroupsData(groupData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching group data:', error);
          setError('Failed to fetch group data');
          setLoading(false);
        }
      }
    };

    fetchGroupsData();
  }, [csrfToken, jwt]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="attendance-page">
      <h1 className="attendance-title">Attendance Groups</h1>
      <div className="attendance-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Sub-Group</th>
              <th>Total Members</th>
              <th>Total Events</th>
              <th>Mentor Hours</th>
              <th>Volunteer Hours</th>
              <th>Upcoming Events</th>
            </tr>
          </thead>
          <tbody>
            {groupsData.length === 0 ? (
              <tr>
                <td colSpan="7" className="attendance-no-data">
                  No Groups Data Available
                </td>
              </tr>
            ) : (
              groupsData.map((group, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/dashboard/attendance-detail/${group.id}`}
                      state={{
                        groupName: group.groupName,
                        subGroup: group.subGroup,
                      }}
                      className="group-link"
                    >
                      {group.groupName}
                    </Link>
                  </td>
                  <td>
                    {group.subGroup
                      ? group.subGroup.split(',').map((sub, i) => (
                          <span key={i} className="subgroup-pill">
                            {sub.trim()}
                          </span>
                        ))
                      : 'N/A'}
                  </td>
                  <td>{group.totalMembers || 'N/A'}</td>
                  <td>{group.totalEvents || 'N/A'}</td>
                  <td>
                    {group.mentorHours ? `${group.mentorHours} hrs` : 'N/A'}
                  </td>
                  <td>
                    {group.volunteerHours
                      ? `${group.volunteerHours} hrs`
                      : 'N/A'}
                  </td>
                  <td>{group.upcomingEvents || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceGroups;

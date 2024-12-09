import React, { useRef, useState } from 'react';
import '../styles/Attendance.css';
import { Inbox, Search, Calendar } from 'lucide-react';
import ChevronDownIcon from '../assets/chevron-down.png';
import ChevronLeftIcon from '../assets/chevron-left.png';
import ChevronRightIcon from '../assets/chevron-right.png';

const Attendance = () => {
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleCalendarClick = (inputRef) => {
    inputRef.current.showPicker(); 
  };

  const handleDateChange = (event, setDate) => {
    setDate(event.target.value);
  };

  return (
    <div className="attendance-page">
      <header className="attendance-header">
        <div className="attendance-left">
          <h2 className="attendance-subtitle">100 Black Men</h2>
          <span className="attendance-title">Attendance</span>
        </div>
      </header>

      <div className="attendance-container">
        <div className="attendance-info attendance-controls">
          <div>
            <p className="attendance-group">Group: Bowen High School</p>
            <p className="attendance-subgroup">SubGroup: Senior</p>
          </div>
          <button className="create-event-button">+ Create Event</button>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <Search size={20} />
            <input type="search" placeholder="" />
          </div>
          <div className="date-box">
            <span>{fromDate ? fromDate : 'From'}</span>
            <Calendar
              size={20}
              onClick={() => handleCalendarClick(fromDateRef)}
            />
            <input
              type="date"
              ref={fromDateRef}
              className="hidden-date-input"
              value={fromDate}
              onChange={(e) => handleDateChange(e, setFromDate)}
            />
          </div>
          <div className="date-box">
            <span>{toDate ? toDate : 'To'}</span>
            <Calendar
              size={20}
              onClick={() => handleCalendarClick(toDateRef)}
            />
            <input
              type="date"
              ref={toDateRef}
              className="hidden-date-input"
              value={toDate}
              onChange={(e) => handleDateChange(e, setToDate)}
            />
          </div>
        </div>

        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>
                  <div className="header-checkbox-wrapper">
                    <input type="checkbox" className="header-checkbox" />
                  </div>
                </th>
                <th>Status</th>
                <th>Event Name</th>
                <th>Attendance</th>
                <th>Date</th>
                <th>Time</th>
                <th>QR Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="attendance-no-data">
                  <Inbox size={48} />
                  <p>No Group Data</p>
                  <p>Please click "+ Create Event" to add new data.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="attendance-pagination">
          <div className="rows-per-page">
            <label>
              <strong className="bold-number">10</strong> per page
            </label>
            <img
              src={ChevronDownIcon}
              alt="Dropdown icon"
              className="dropdown-icon"
            />
          </div>
          <div className="pagination-box">
            <span className="pagination-count">
              <strong className="bold-number">0</strong> of 0
            </span>
            <button disabled>
              <img src={ChevronLeftIcon} alt="Previous page" />
            </button>
            <button disabled>
              <img src={ChevronRightIcon} alt="Next page" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

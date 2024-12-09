import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Card, CardContent, CardActions, Typography, Grid } from '@mui/material';
import { EventTypesReq, GetCsrfToken } from './EventTypes';
import '../styles/landingPage.css';
import backgroundImage from '../assets/bcombsbackground2.webp';
const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [csrfToken, setCsrfToken] = useState(null);
  const [eventTypesList, setEventTypesList] = useState([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [showEventTypesFilter, setShowEventTypesFilter] = useState(false);
  const [zipList, setZipList] = useState([]);
  const [selectedZips, setSelectedZips] = useState([]);
  const [showZipFilter, setShowZipFilter] = useState(false);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5001/search/events');
        const data = await response.json();
        
        setEvents(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };    fetchEvents();
  }, []);  
  
  useEffect(() => {
    const getCSRF = async () => {
      const token = await GetCsrfToken();
      setCsrfToken(token);
    };

    getCSRF();
  }, []);
  
  useEffect(() => {
    const getEventTypes = async () => {
      try {

        const eventTypesPromises = events.map(event => EventTypesReq(event.id, csrfToken));
        const eventTypesResults = await Promise.all(eventTypesPromises);
        setEventTypesList([...new Set(eventTypesResults.flat())]);

        //set each event's event types
        for (const event of events) {
          try {
            const eventTypes = await EventTypesReq(event.id, csrfToken);
            //
            event.eventTypes = eventTypes;
          } catch (error) {
            console.error("Error fetching event types for event ID:", event.id, error);
          }
          //
        }
        
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    getEventTypes();
  }, [events, csrfToken]);

  useEffect(() => {
    const getEventZips = async () => {
      try {

        var zips = [];

        //set each event's event types
        for (const event of events) {
          try {
            zips.push(event.zip);
          } catch (error) {
            console.error("Error fetching event zip code for event ID:", event.id, error);
          }
        }

        setZipList(zips);
        
      } catch (error) {
        console.error('Error fetching event zips:', error);
      }
    };

    getEventZips();
  }, [events, csrfToken]);
  //

  const handleCheckboxChange = (e, eventType) => {
    if (e.target.checked) {
      // Add the selected event type to the array
      setSelectedEventTypes([...selectedEventTypes, eventType]);
    } else {
      // Remove the deselected event type from the array
      setSelectedEventTypes(selectedEventTypes.filter(item => item !== eventType));
    }
  };

  const handleZipChange = (e, zip) => {
    if (e.target.checked) {
      setSelectedZips([...selectedZips, zip]);
    } else {
      setSelectedZips(selectedZips.filter(item => item !== zip));
    }
  };
  
  const handleSearch = (e) => {
    //console.log(events)
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(query.toLowerCase()) &&
      selectedEventTypes.every(type => event.eventTypes.includes(type)) &&
      (selectedZips.length === 0 || selectedZips.includes(event.zip))
    );
    setFilteredItems(filtered);
  };

  const toggleFilterDropdown = () => {
    setShowEventTypesFilter(!showEventTypesFilter);
    if (showZipFilter) {
      setShowZipFilter(false);
    }
  };

  const toggleZipFilterDropdown = () => {
    setShowZipFilter(!showZipFilter);
    if (showEventTypesFilter) {
      setShowEventTypesFilter(false);
    }
  };

  //visual portion
  return (
    <Container 
      maxWidth={false}  // Full width container
      className="landing-page-container" 
      style={{
        padding: 0, // Remove extra padding around the container 
        margin: 0,
      }}
    >
      {/* Full Screen Background Section */}
      <div style = {{
        width: '100vw',
        height: '65vh', 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', // Ensure the image covers the entire background
        backgroundPosition: 'center', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',  // Center content vertically and horizontally
        position: 'relative'
      }}>
        {/* Discover Events Section */}
        <Card 
        className="discover-card" 
        elevation={3} 
        style={{ 
          position: 'absolute', // Position the card absolutely
          top: 0,  // Align to the top of the container
          left: 0, // Align to the left of the container
          margin: '20px', // Optional margin for some spacing from the edges
          padding: '20px', 
          width: '40%', 
          textAlign: 'left', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background for visual separation
          borderRadius: '16px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'  // Card shadow for elevation
        }}
      >
          <Typography variant="h4" style={{ fontWeight: 'bold' }} gutterBottom>
            Discover Events
          </Typography>
          <Typography variant="body1" gutterBottom>
            Find events for your interests and opportunities to network and build community!
          </Typography>
  
          {/* Search Section */}
          <div className="search-section" style={{ marginTop: '20px' }}>
            <TextField
              fullWidth
              label="Search for an event"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              style={{ marginBottom: '15px' }}
            />
            <div className="filter-actions" style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
              <Button variant="outlined" style={{ color: '#000', borderColor: '#FFB347', fontWeight: 'bold' }}
                onClick={toggleZipFilterDropdown}>Location (Zip)</Button>
              <Button variant="outlined" style={{ color: '#000', borderColor: '#FFB347', fontWeight: 'bold' }}
                onClick={toggleFilterDropdown}>Event Types</Button>
              <Button variant="contained" style={{ backgroundColor: '#FFB347', color: '#000', fontWeight: 'bold' }} onClick={handleSearch}>Find Events</Button>
            </div>
          </div>
  
          {/* Event Types Dropdown */}
          {showEventTypesFilter && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ backgroundColor: 'white', color: '#FFB347', borderColor: '#000', fontWeight: 'bold', padding: '10px', borderRadius: '5px' }}>
                {Array.isArray(eventTypesList) && eventTypesList.length > 0 ? (
                  eventTypesList.map((eventType, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <label htmlFor={`checkbox-${index}`}>{eventType}</label>
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        value={eventType}
                        checked={Array.isArray(selectedEventTypes) && selectedEventTypes.includes(eventType)}
                        onChange={(e) => handleCheckboxChange(e, eventType)}
                        style={{ position: 'absolute', right: '0' }}
                      />
                    </div>
                  ))
                ) : (
                  <div>No event types available</div>
                )}
              </div>
            </div>
          )}
  
          {/* Zip Code Dropdown */}
          {showZipFilter && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ backgroundColor: 'white', color: '#FFB347', borderColor: '#000', fontWeight: 'bold', padding: '10px', borderRadius: '5px' }}>
                {zipList.length > 0 ? (
                  zipList.map((zip, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <label htmlFor={`zip-checkbox-${index}`}>{zip}</label>
                      <input
                        type="checkbox"
                        id={`zip-checkbox-${index}`}
                        value={zip}
                        checked={selectedZips.includes(zip)}
                        onChange={(e) => handleZipChange(e, zip)}
                        style={{ position: 'absolute', right: '0' }}
                      />
                    </div>
                  ))
                ) : (
                  <div>No zip codes available</div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
  
      {/* Popular Events Section */}
      <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: '10px', padding: '30px' }} gutterBottom>
        Popular Events
      </Typography>
      <Grid container spacing={1} style={{ padding: '0 20px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((event, index) => (
            <Grid item xs={12} sm={6} md={2} key={index} style={{ padding: '10px' }}> {/* Reduced padding */}
            <Card className="event-card" elevation={2} style={{ width: '100%', margin: '10px' }}> {/* Adjusted card width */}
              <CardContent style={{ padding: '30px' }}> {/* Added more padding */}
                  <Typography variant="h5" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" style={{ backgroundColor: '#FFB347', color: '#000', fontWeight: 'bold' }} fullWidth>
                    Reserve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No events found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
  
};

export default LandingPage;
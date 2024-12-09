// define get event types
export const EventTypesReq = async (id, csrfToken) => {
  const requestData = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify( {id} ),
  };

  var response = null;
  try {
    response = await fetch('http://localhost:5001/search/event-types', requestData);
  } catch (error) {
    console.error('Error fetching event types data:', error);
  }
  const data = await response.json();
  return data;
};

// define get csrf token
export const GetCsrfToken = async () => {
  const response = await fetch('http://localhost:5001/csrf-token', {
    credentials: 'include'
  });
  const tokenData = await response.json();
  return tokenData.csrfToken;
};


//export default EventTypesReq;
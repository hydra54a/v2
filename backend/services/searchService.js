const EventRepository = require('../repositories/EventRepository');

//define db connection for getting events
async function getEvents(){
  events = EventRepository.getEvents();
  return events;
}

//define db connection for getting event types
async function getEventTypes(eventId){
  eventTypes = EventRepository.getEventTypes(eventId);
  return eventTypes;
}

module.exports = {
  getEvents,
  getEventTypes
}
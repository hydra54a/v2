
const knex = require('knex')(require('../knexfile').development);
const getKnex = require('../db/getKnex');
const EventModel = require('../models/UserModel');

//define db connection for getting events
async function getEvents(){
  const knex = getKnex();
  events = await knex('Events').select('*');
  return events;
}

//define db connection for getting event types
async function getEventTypes(eventId){
  const knex = getKnex();
  //
  eventTypes = [];
  typeMapping = await knex('MapEventTypes').where('event_id', eventId.id).select('*');
  typeMapping = typeMapping.map((typeId) => typeId.event_type_id);
  //
  eventTypes = await knex('EventTypes').whereIn('id', typeMapping).select('*');
  eventTypes = eventTypes.map((type) => type.event_type);
  //
  return eventTypes;
}

module.exports = {
  getEvents,
  getEventTypes
}

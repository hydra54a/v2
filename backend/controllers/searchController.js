const searchService = require('../services/searchService');

// define function how to handle info from db when getting events
async function getEvents(req, res, next) {
    
    try {
        const events = await searchService.getEvents();
        res.json(events);
    } catch (err) {
        console.error(`Error while getting event information: `, err.message);
        next(err);
    }
}

// define function how to handle info from db when getting event types
async function getEventTypes(req, res, next) {
    
    try {
        const eventTypes = await searchService.getEventTypes(req.body);
        res.json(eventTypes);
    } catch (err) {
        console.error(`Error while getting event information: `, err.message);
        next(err);
    }
}

module.exports = { 
    getEvents, 
    getEventTypes
};
const jwt = require('jsonwebtoken');
const groupService = require('../services/groupService');

// Create or update a group (JWT & CSRF verification)
async function createOrUpdateGroup(req, res, next) {
    try {
        const groupData = req.body;

        if (groupData.capacity !== null && groupData.capacity <= 0) {
            return res.status(400).json({ message: 'Capacity must be greater than zero' });
        }

        const result = await groupService.createOrUpdateGroup(groupData);
        res.status(201).json(result);
    } catch (err) {
        console.error(`Error while creating or updating group:`, err.message);
        next(err);
    }
}

async function addUsersToGroup(req, res, next) {
    try {
        // Change organizationId to organization_id to match the incoming request body
        const { organization_id, emails } = req.body;

        // Assuming groupService is handling the database interaction
        const result = await groupService.addUsersToGroup(organization_id, emails);
        res.json(result);
    } catch (err) {
        console.error(`Error while adding users to group:`, err.message);
        next(err);
    }
}

// Get group details by organization ID
async function getGroupDetailsByOrgId(req, res, next) {
    try {
        const organizationId = req.params.organizationId;
        const groupDetails = await groupService.getGroupDetailsByOrgId(organizationId);
        res.json(groupDetails);
    } catch (err) {
        console.error(`Error while getting group details:`, err.message);
        next(err);
    }
}

async function getAllGroups(req, res, next) {
    try {
        // Extract token from headers
        const token = req.headers.authorization.split(' ')[1];

        // Pass the token to the service to get the groups
        const groups = await groupService.getGroupsByUser(token);

        // Return the groups
        res.json(groups);
    } catch (err) {
        console.error('Error while getting groups:', err);
        next(err); // Forward the error to the error handler
    }
}

async function getAllGroupEmails(req, res, next) {
    try {
        const { organizationId } = req.params; // Get organizationId from the route params
        const emails = await groupService.getAllGroupEmails(organizationId); // Pass organizationId to the service
        res.json(emails); // Send the emails back as a JSON response
    } catch (err) {
        console.error(`Error while getting group emails:`, err.message);
        next(err);
    }
}

async function deleteGroupById(req, res, next) {
    try {
        const groupId = req.params.id;
        const result = await groupService.deleteGroupById(groupId);
        res.json(result);
    } catch (err) {
        console.error(`Error while deleting group:`, err.message);
        next(err);
    }
}


module.exports = {
    createOrUpdateGroup,
    getGroupDetailsByOrgId,
    addUsersToGroup,
    getAllGroups,
    getAllGroupEmails,
    deleteGroupById
};

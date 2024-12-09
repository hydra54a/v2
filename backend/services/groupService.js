const GroupRepository = require('../repositories/GroupRepository');
const config = require('../config');
const jwt = require('jsonwebtoken');


// Create or update a group
async function createOrUpdateGroup(groupData) {
    return await GroupRepository.createOrUpdateGroup(groupData);
}

// Add users to a group by their emails
async function addUsersToGroup(organizationId, emails) {
    return await GroupRepository.addUsersToGroup(organizationId, emails);
}

// Get group details by organization ID
async function getGroupDetailsByOrgId(organizationId) {
    return await GroupRepository.getGroupDetailsByOrgId(organizationId);
}

async function getGroupsByUser(token) {
    try {
        // Decode the JWT token to get the user ID
        const decoded = jwt.verify(token, config.jwtSecret);
        const userId = decoded.id;
        
        const organizationId = await GroupRepository.getOrganizationIdByUserId(userId);
        
        if (!organizationId) {
            throw new Error('User not found in any organization');
        }

        const name = await GroupRepository.getGroupsByOrganizationId(userId);
        
        return {
            organizationId,
            name
        };
    } catch (err) {
        throw new Error('Error fetching groups: ' + err.message);
    }
}


async function getAllGroupEmails(organizationId) {
    return await GroupRepository.getAllGroupEmails(organizationId); 
}

async function deleteGroupById(groupId) {
    return await GroupRepository.deleteGroupById(groupId);
}


module.exports = {
    createOrUpdateGroup,
    getGroupDetailsByOrgId,
    addUsersToGroup,
    getGroupsByUser,
    getAllGroupEmails,
    deleteGroupById
};

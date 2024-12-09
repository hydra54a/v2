const knex = require('knex')(require('../knexfile').development);
const getKnex = require('../db/getKnex');

async function createOrUpdateGroup(groupData) {
    const knex = getKnex();
    const { organization_id, name, subgroups, user_emails, form_type, capacity } = groupData;

    // Check if there's already a group with the same name
    const duplicateGroup = await knex('OrganizationGroups')
        .where({ organization_id , name })
        .first();

    if (duplicateGroup && !groupData.id) {
        // If a group with the same name exists, reject the creation
        return { message: 'Group with this name already exists' };
    } else {
        // If no duplicate, insert or update the group
        await knex('OrganizationGroups').insert(groupData).onConflict('id').merge();

        return { message: 'Group created successfully' };
    }
}

// Group Repository - Add users to a group
async function addUsersToGroup(organizationId, emails) {
    const knex = getKnex();
     // Debugging
    const group = await knex('OrganizationGroups')
        .where({ organization_id: organizationId })
        .first();

    if (group) {
         // Debugging
        const emailArray = Array.isArray(emails) ? emails : [emails];

        // Ensure that there are no extra commas or duplicates
        const currentEmails = group.user_emails ? group.user_emails.split(',') : [];
        const updatedEmails = [...new Set([...currentEmails, ...emailArray])]; // Remove duplicates
        const updatedEmailsString = updatedEmails.join(','); // Convert array back to comma-separated string

        // Update the database with the new user emails
        await knex('OrganizationGroups')
            .where({ id: group.id })
            .update({ user_emails: updatedEmailsString });

        return { message: 'Users added to group successfully' };
    } else {
        throw new Error('Group not found');
    }
}

// Get group details by organization ID
async function getGroupDetailsByOrgId(organizationId) {
    const knex = getKnex();
    const groupDetails = await knex('OrganizationGroups')
        .where({ organization_id: organizationId })
        .select('*');
    return groupDetails;
}


async function getOrganizationIdByUserId(userId) {
    const knex = getKnex();
    const result = await knex('UserOrganizations')
        .where({ user_id: userId })
        .select('organization_id')
        .first();

    return result ? result.organization_id : null;
}

async function getGroupsByOrganizationId(userId) {
    const knex = getKnex();
    const groups = await knex('Organizations')
        .where({ user_id: userId })
        .select('name')
        .first();

    return groups ? groups.name : null;
}


async function getAllGroupEmails(organizationId) {
    const knex = getKnex();
    /*
    const groupDetails = await knex('OrganizationGroups')
        .where({ organization_id: organizationId })
        .select('user_emails'); // Ensure user_emails are returned
    */
    
    const userEmails = await knex('UserOrganizations')
        .where({ organization_id: organizationId })
        .join('Users', 'UserOrganizations.user_id', 'Users.id') // Join UserOrganizations with Users
        .select('Users.email');
    const emailArray = userEmails.map(record => record.email);
    
    if (emailArray.length === 0) {
        return []; // Return an empty array if no records are found
    }

    // Optionally, return the emails as an array of emails from comma-separated string
    return emailArray.join(',');//emailArray.map(group => group.user_emails).join(','); // If you want them as a single comma-separated string
}

async function deleteGroupById(groupId) {
    const knex = getKnex();
    const result = await knex('OrganizationGroups')
        .where({ id: groupId })
        .del(); // Perform the delete operation
    if (result) {
        return { message: 'Group deleted successfully' };
    } else {
        throw new Error('Group not found');
    }
}


module.exports = {
    createOrUpdateGroup,
    getGroupDetailsByOrgId,
    addUsersToGroup,
    getOrganizationIdByUserId,
    getGroupsByOrganizationId,
    getAllGroupEmails,
    deleteGroupById
};

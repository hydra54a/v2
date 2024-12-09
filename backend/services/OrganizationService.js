// services/OrganizationService.js
const OrganizationRepository = require('../repositories/OrganizationRepository');
const getKnex = require('../db/getKnex');

class OrganizationService {
  async completeOrganizationSetup({
    userId,
    organizationName,
    organizationType,
    industry,
    roleInCompany,
    phoneNumber,
    primaryAddress,
    audience,
    painPoints,
    startingPoint,
    responsibilities,
    goals,
  }) {
    // Ensure the user exists
    const existingUser = await OrganizationRepository.findUserById(userId);
    if (!existingUser) {
      const error = new Error('User not found');
      error.status = 404;  // Set the status to 404
      throw error;
    }

    // Ensure the organization type exists
    const existingType = await OrganizationRepository.findOrganizationTypeById(organizationType);
    if (!existingType) {
      throw new Error('Organization type not found');
    }

    // Mark user registration as complete
    await this.completeUserRegistration(userId);

    // Insert organization and related data
    const orgId = await OrganizationRepository.insertOrganization({
      name: organizationName,
      type_id: organizationType,
      industry,
      primary_address: primaryAddress,
      phone_number: phoneNumber,
      user_id: userId,
      role_in_company: roleInCompany,
      audience,
      pain_points: painPoints,
      get_started_preference: startingPoint,
      responsibilities,
      goals: JSON.stringify(goals),
      organization_code: this.generateUniqueCode(),
    });

    // Insert user roles and link to organization
    await OrganizationRepository.insertUserRoles({
      user_id: userId,
      user_type_id: 1, // Assuming default user role type
    });

    await OrganizationRepository.insertUserOrganization({
      user_id: userId,
      organization_id: orgId,
      role_in_organization: roleInCompany,
    });

    return orgId;
  }

  async joinOrganization(userId, organizationCode) {
    // Find the organization by code
    const organization = await OrganizationRepository.findOrganizationByCode(organizationCode);
    if (!organization) {
      const error = new Error('Organization not found');
      error.status = 404;  
      throw error;
    }

    // Add user to the organization
    await OrganizationRepository.insertUserOrganization({
      user_id: userId,
      organization_id: organization.id,
      role_in_organization: 'Member', 
    });

    // Update UserRoles table to assign the user_type_id for 'Student'
    await OrganizationRepository.insertUserRoles({
      user_id: userId,
      user_type_id: 5, // role
    });

    return organization.id;
  }

  async joinOrganizationWithoutCode(userId) {
    const knex = getKnex();
    
    // Ensure the user exists
    const existingUser = await knex('Users').where({ id: userId }).first();
    if (!existingUser) {
      const error = new Error('User not found');
      error.status = 404;  // Set the status to 404
      throw error; // Return an error instead of using res in services
    }
    
    // Insert user role
    await OrganizationRepository.insertUserRoles({
      user_id: userId, 
      user_type_id: 6, // read only user
    });
    
    return userId; // Return userId
  }
  

  // Function to mark user registration as complete
  async completeUserRegistration(userId) {
    const knex = getKnex();
    await knex('Users')
      .where({ id: userId })
      .update({ registration_status: 'complete' });
  }

  // Function to generate a unique organization code
  generateUniqueCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  async getOrganizationByUser(userId) {
    return await OrganizationRepository.findOrganizationByUser(userId);
  }

  async getOrganizationDetailsById(orgId) {
    return await OrganizationRepository.getOrganizationDetailsById(orgId);
  }
  
}

module.exports = OrganizationService; // Export the class definition

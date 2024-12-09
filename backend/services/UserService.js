
const UserRepository = require('../repositories/UserRepository');
const { hashPassword } = require('../utils/passwordUtils');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createAccount(userData) {
    const existingUser = await this.userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(userData.password);
    const user = await this.userRepository.createUser({ 
      ...userData, 
      pwd: hashedPassword 
    });

    await this.userRepository.createUserProfile(user.id, userData.firstname, userData.lastname);

    return user;
  }
  async findUserByEmail(email) {
    return await this.userRepository.findUserByEmail(email); // Delegate to the repository
  }
  async getUserDetailsByEmail(email) {
    return await this.userRepository.getUserDetailsByEmail(email); // Delegate to the repository
  }


  async getUserDetailsById(userId) {
    return await this.userRepository.getUserDetailsById(userId); // Delegate to the repository
  }

  async getOrganizationUsers(organizationId) {
    return await this.userRepository.getOrganizationUsers(organizationId);
  }

  async sendInvitation(email, organizationId) {
    const organization = await this.userRepository.getOrganization(organizationId);
    const organizationCode = organization.organization_code;
    
    // Generate invitation email
    const emailContent = `
      Dear Future Team Member,

      You've been invited to join ${organization.name} on our CRM platform!

      To get started:
      1. Visit: https://yourcrm.example.com/signup
      2. Use this organization code: ${organizationCode}
      3. Complete your profile

      If you have any questions, please contact your administrator.

      Best regards,
      The CRM Team
      this one is send
    `;

    // TODO: Integrate with your email service
    
    

    return true;
  }

  async updateUserRole(userId, userTypeId) {
    return await this.userRepository.updateUserRole(userId, userTypeId);
  }

  static async deleteUser(userId) {
    // Fetch the user's role to determine if they are a Super Admin
    const user = await UserRepository.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Assuming that Super Admin has a userTypeId of 1
    if (user.userTypeId === 1) {
      throw new Error('Cannot delete a Super Admin');
    }

    // Proceed to delete the user if they are not a Super Admin
    await UserRepository.deleteUser(userId);
  }
  
  static async getOrganizationCode(organizationId) {
    const knex = require('../db/getKnex')(); // Ensure knex is initialized here
    try {
      const organization = await knex('Organizations')
        .where('id', organizationId)
        .select('organization_code')
        .first();
  
      if (!organization) {
        throw new Error('Organization not found');
      }
  
      return organization.organization_code;
    } catch (error) {
      console.error('Error fetching organization code:', error);
      throw error;
    }
  }
  
  
  

  static async getOrganizationIdByUserId(userId) {
    
    const organizationId = await UserRepository.getOrganizationIdByUserId(userId);
    if (!organizationId) {
      throw new Error('Organization not found for user');
    }
    return organizationId;
  }


}



module.exports = UserService;



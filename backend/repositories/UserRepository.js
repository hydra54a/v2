
const getKnex = require('../db/getKnex');
const UserModel = require('../models/UserModel');

class UserRepository {
  async createUser(userData) {
    const knex = getKnex();
    const [userId] = await knex('Users').insert({
      email: userData.email,
      pwd: userData.pwd,
      created_at: new Date(),
    });
    return new UserModel(userId, userData.email, userData.pwd, userData.firstname, userData.lastname);
  }

  async createUserProfile(userId, firstName, lastName) {
    const knex = getKnex();
    await knex('UserProfiles').insert({
      user_id: userId,
      firstname: firstName,
      lastname: lastName,
    });
  }

  async findUserByEmail(email) {
    const knex = getKnex();
    return await knex('Users').where({ email }).first();
  }
  
  async getUserDetailsByEmail(email) {
    const knex = getKnex();
    const user = await knex('Users')
      .join('UserProfiles', 'Users.id', 'UserProfiles.user_id')  // Join based on user ID
      .select('Users.id', 'UserProfiles.firstname', 'UserProfiles.lastname') // Select required fields
      .where('Users.email', email)
      .first();
  
    return user;
  }


  async getUserDetailsById(userId) {
    const knex = getKnex();
    const user = await knex('Users')
      .join('UserProfiles', 'Users.id', 'UserProfiles.user_id')  // Join based on user ID
      .select('Users.id', 'UserProfiles.firstname', 'UserProfiles.lastname') // Select required fields
      .where('Users.id', userId)
      .first();
  
    return user;
  }
  // UserRepository.js
async getOrganizationUsers(organizationId) {
  const knex = getKnex();
  try {
    const users = await knex('Users AS u')
      .join('UserProfiles AS up', 'u.id', 'up.user_id')
      .join('UserOrganizations AS uo', 'u.id', 'uo.user_id')
      .join('UserRoles AS ur', 'u.id', 'ur.user_id')
      .join('UserTypes AS ut', 'ur.user_type_id', 'ut.UserTypeID')
      .where('uo.organization_id', organizationId)
      .select(
        'u.id',
        'u.email',
        'up.firstname',
        'up.lastname',
        'up.address',
        'ut.TypeName as role',
        'ut.UserTypeID as roleId'
      );

     // For debugging
    return users;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

  async getOrganization(organizationId) {
    const knex = getKnex();
    return await knex('Organizations')
      .where('id', organizationId)
      .first();
  }

  async updateUserRole(userId, userTypeId) {
    const knex = getKnex();
    return await knex('UserRoles')
      .where('user_id', userId)
      .update({
        user_type_id: userTypeId,
        updated_at: new Date()
      });
  }

  static async deleteUser(userId) {
    const knex = getKnex(); // Ensure knex is defined
    try {
      await knex.transaction(async trx => {
        await trx('UserRoles').where('user_id', userId).del();
        await trx('UserOrganizations').where('user_id', userId).del();
        await trx('UserProfiles').where('user_id', userId).del();
        await trx('Users').where('id', userId).del();
      });
    } catch (error) {
      console.error('Error in UserRepository.deleteUser:', error);
      throw error;
    }
  }


  static async getOrganizationIdByUserId(userId) {
    const knex = getKnex(); // Ensure knex is defined here
    try {
      const userOrg = await knex('UserOrganizations')
        .where('user_id', userId)
        .select('organization_id')
        .first();

      return userOrg ? userOrg.organization_id : null;
    } catch (error) {
      console.error('Error in UserRepository.getOrganizationIdByUserId:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;

// repositories/OrganizationRepository.js
const getKnex = require('../db/getKnex');

class OrganizationRepository {
  async findUserById(userId) {
    const knex = getKnex();
    return knex('Users').where({ id: userId }).first();
  }

  async findOrganizationTypeById(typeId) {
    const knex = getKnex();
    return knex('OrganizationTypes').where({ id: typeId }).first();
  }

  async insertOrganization(orgData) {
    const knex = getKnex();
    const [orgId] = await knex('Organizations').insert(orgData);
    return orgId;
  }

  async insertUserRoles(userRolesData) {
    const knex = getKnex();
    return knex('UserRoles').insert(userRolesData);
  }

  async insertUserOrganization(userOrganizationData) {
    const knex = getKnex();
    return knex('UserOrganizations').insert(userOrganizationData);
  }

  async findOrganizationByCode(organizationCode) {
    const knex = getKnex();
    return knex('Organizations').where({ organization_code: organizationCode }).first();
  }


  async findOrganizationByUser(userId) {
    const knex = getKnex();
    return knex('UserOrganizations')
      .join('Organizations', 'UserOrganizations.organization_id', '=', 'Organizations.id')
      .select('Organizations.*') // Fetch all columns from Organizations table
      .where({ 'UserOrganizations.user_id': userId });
  }
  
  async getOrganizationDetailsById(orgId) {
    const knex = getKnex();
    return knex('Organizations').where({ id: orgId }).first();
  }
}

module.exports = new OrganizationRepository();


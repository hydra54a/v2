const FormRepository = require('../repositories/FormRepository');

class FormService {
  async createForm(formData) {
    
    return await FormRepository.createForm(formData);
  }

  async getFormById(formId) {
    return await FormRepository.getFormById(formId);
  }

  async getAllForms() {
    return await FormRepository.getAllForms();
  }

  async getFormsByUser(userId) {
    return await FormRepository.getFormsByUser(userId);
  }
  async getFormsByOrganization(organizationId) {
    return await FormRepository.getFormsByOrganization(organizationId);
  }

  async deleteForm(formId) {
    return await FormRepository.deleteForm(formId);
  }

  async editForm(formId, formData) {
    return await FormRepository.editForm(formId, formData);
  }
}

module.exports = new FormService();

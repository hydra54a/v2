const getKnex = require('../db/getKnex');

class FormRepository {
  async createForm(formData) {
    
    const knex = getKnex();
    const [formId] = await knex('Forms').insert({
      user_id: formData.user_id,
      organization_id: formData.organization_id,
      form_type: formData.form_type,
      categories: formData.categories,
      association: formData.association,
      title: formData.title,
      description: formData.description,
      copyright_protected: formData.copyright_protected || false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Insert each field associated with the form
    for (const field of formData.fields) {
      await knex('FormFields').insert({
        form_id: formId,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || null,
        required: field.required || false,
        options: field.options ? JSON.stringify(field.options) : null,
        position: field.position || null
      });
    }

    return { id: formId, ...formData };
  }

  async getFormById(formId) {
    const knex = getKnex();
    const form = await knex('Forms')
      .where({ id: formId })
      .first();

    if (form) {
      const fields = await knex('FormFields')
        .where({ form_id: formId })
        .orderBy('position');

      form.fields = fields.map(field => ({
        id: field.id,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder,
        required: field.required,
        options: field.options ? JSON.parse(field.options) : [],
        position: field.position
      }));
    }

    return form;
  }

  async getAllForms() {
    const knex = getKnex();
    
    // Fetch forms
    const forms = await knex('Forms')
      .select('id', 'user_id', 'organization_id', 'form_type', 'categories', 'association', 'title', 'description', 'copyright_protected', 'created_at', 'updated_at');

    // For each form, fetch associated fields
    for (const form of forms) {
      const fields = await knex('FormFields')
        .where({ form_id: form.id })
        .select('id', 'type', 'label', 'placeholder', 'required', 'options', 'position');
      
      // Parse JSON options if they exist
      form.fields = fields.map(field => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : []
      }));
    }

    return forms;
  }

  async getFormsByUser(userId) {
    const knex = getKnex();
    
    // Fetch forms for the specified user
    const forms = await knex('Forms')
      .where({ user_id: userId })
      .select('id', 'organization_id', 'form_type', 'categories', 'association', 'title', 'description', 'copyright_protected', 'created_at', 'updated_at');

    // For each form, fetch associated fields
    for (const form of forms) {
      const fields = await knex('FormFields')
        .where({ form_id: form.id })
        .select('id', 'type', 'label', 'placeholder', 'required', 'options', 'position');
      
      // Parse JSON options if they exist
      form.fields = fields.map(field => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : []
      }));
    }

    return forms;
  }

  async getFormsByOrganization(organizationId) {
    const knex = getKnex();
    
    // Fetch forms for the specified organization
    const forms = await knex('Forms')
      .where({ organization_id: organizationId })
      .select('id', 'user_id', 'form_type', 'categories', 'association', 'title', 'description', 'copyright_protected', 'created_at', 'updated_at');

    // For each form, fetch associated fields
    for (const form of forms) {
      const fields = await knex('FormFields')
        .where({ form_id: form.id })
        .select('id', 'type', 'label', 'placeholder', 'required', 'options', 'position');
      
      // Parse JSON options if they exist
      form.fields = fields.map(field => ({
        ...field,
        options: field.options ? JSON.parse(field.options) : []
      }));
    }

    return forms;
  }

  async deleteForm(formId) {
    const knex = getKnex();
    const deletedRows = await knex('Forms')
      .where({ id: formId })
      .del();

    // Also delete associated fields
    if (deletedRows) {
      await knex('FormFields').where({ form_id: formId }).del();
    }

    return deletedRows > 0;
  }

  async editForm(formId, formData) {
    const knex = getKnex();

    // Update form metadata
    const updatedRows = await knex('Forms')
      .where({ id: formId })
      .update({
        user_id: formData.user_id,
        organization_id: formData.organization_id,
        form_type: formData.form_type,
        categories: formData.categories,
        association: formData.association,
        title: formData.title,
        description: formData.description,
        copyright_protected: formData.copyright_protected || false,
        updated_at: new Date()
      });

    if (updatedRows > 0) {
      // Update fields
      await knex('FormFields').where({ form_id: formId }).del(); // Clear existing fields
      for (const field of formData.fields) {
        await knex('FormFields').insert({
          form_id: formId,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || null,
          required: field.required || false,
          options: field.options ? JSON.stringify(field.options) : null,
          position: field.position || null
        });
      }

      return await this.getFormById(formId); // Return the updated form data
    }

    return null;
  }
}

module.exports = new FormRepository();

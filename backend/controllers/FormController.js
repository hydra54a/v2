const FormService = require('../services/FormService');

class FormController {
  async createForm(req, res) {
    
    try {
      const formData = req.body;
      const form = await FormService.createForm(formData);
      res.status(201).json({ message: 'Form created successfully', form });
    } catch (error) {
      console.error('Error creating form:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getFormById(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormService.getFormById(formId);
      if (form) {
        res.status(200).json({ form });
      } else {
        res.status(404).json({ message: 'Form not found' });
      }
    } catch (error) {
      console.error('Error fetching form:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getAllForms(req, res) {
    try {
      const forms = await FormService.getAllForms();
      res.status(200).json({ forms });
    } catch (error) {
      console.error('Error fetching forms:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getFormsByUser(req, res) {
    try {
      const { userId } = req.params;
      const forms = await FormService.getFormsByUser(userId);
      res.status(200).json({ forms });
    } catch (error) {
      console.error('Error fetching forms by user:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getFormsByOrganization(req, res) {
    try {
      const { organizationId } = req.params;
      const forms = await FormService.getFormsByOrganization(organizationId);
      res.status(200).json({ forms });
    } catch (error) {
      console.error('Error fetching forms by organization:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async deleteForm(req, res) {
    try {
      const { formId } = req.params;
      const success = await FormService.deleteForm(formId);
      if (success) {
        res.status(200).json({ message: 'Form deleted successfully' });
      } else {
        res.status(404).json({ message: 'Form not found' });
      }
    } catch (error) {
      console.error('Error deleting form:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async editForm(req, res) {
    try {
      const { formId } = req.params;
      const formData = req.body;
      const form = await FormService.editForm(formId, formData);
      if (form) {
        res.status(200).json({ message: 'Form updated successfully', form });
      } else {
        res.status(404).json({ message: 'Form not found' });
      }
    } catch (error) {
      console.error('Error updating form:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
}

module.exports = new FormController();

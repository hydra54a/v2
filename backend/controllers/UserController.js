// controllers/UserController.js
const UserService = require('../services/UserService');
const OrganizationService = require('../services/OrganizationService'); // Import the class
const EmailService = require('../services/EmailService');

class UserController {
  constructor() {
    this.userService = new UserService(); // Correct instantiation of UserService
    this.organizationService = new OrganizationService(); // Correct instantiation of OrganizationService
  }

  async createAccount(req, res) {
    try {
      const { email, password, firstname, lastname } = req.body;
      if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const user = await this.userService.createAccount({ email, password, firstname, lastname });
      res.status(201).json({ message: 'Account created successfully', userId: user.id });
    } catch (error) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({ error: error.message });
      }
      console.error('Error creating account:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async completeOrganizationSetup(req, res) {
    try {
      const orgId = await this.organizationService.completeOrganizationSetup(req.body);
      if (!orgId) {
        return res.status(404).json({ error: 'User not found' }); 
      }
      res.status(201).json({ message: 'Organization setup complete', orgId });
    } catch (error) {
      if (error.status === 404) {
        // Handle "user not found" with a 404 status code
        return res.status(404).json({ error: error.message });
      }
      console.error('Error completing organization setup:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
  

  async joinOrganization(req, res) {
    try {
      const { userId, organizationCode } = req.body;
      const organizationId = await this.organizationService.joinOrganization(userId, organizationCode);
      res.status(200).json({ message: 'User added to organization', organizationId });
    } catch (error) {
      console.error('Error joining organization:', error.message);
      const statusCode = error.status || 500;
    res.status(statusCode).json({ error: error.message });
    }
  }

  async joinOrganizationWithoutCode(req, res) {
    try {
      const { userId } = req.body;
      await this.organizationService.joinOrganizationWithoutCode(userId);
      res.status(201).json({ message: 'Account created with read-only access', userId }); // Return 201
    } catch (error) {
      console.error('Error joining without code:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getUserDetailsByEmail(req, res) {
    try {
      const { email } = req.query;
      const user= await this.userService.getUserDetailsByEmail(email);
      if (user) {
        res.status(200).json({ message: 'User found!', user });
      } else {
        res.status(404).json({ message: 'User not found!' });
      }
    } catch (error) {
      console.error('User with that email is not found', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }


  async getOrganizationByUser(req, res) {
    try {
      const { userId } = req.params;
      const organization = await this.organizationService.getOrganizationByUser(userId);
      if (organization) {
        res.status(200).json({ message: 'Organization found!', organization });
      } else {
        res.status(404).json({ message: 'Organization not found!' });
      }
    } catch (error) {
      console.error('Error getting organization by user:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getUserDetailsById(req, res) {
    try {
      const { userId } = req.params;
      const user = await this.userService.getUserDetailsById(userId);
      if (user) {
        res.status(200).json({ message: 'User found!', user });
      } else {
        res.status(404).json({ message: 'User not found!' });
      }
    } catch (error) {
      console.error('Error getting user by id:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  async getOrganizationDetailsById(req, res) {
    try {
      const { orgId } = req.params;
      const organization = await this.organizationService.getOrganizationDetailsById(orgId);
      if (organization) {
        res.status(200).json({ message: 'Organization found!', organization });
      } else {
        res.status(404).json({ message: 'Organization not found!' });
      }
    } catch (error) {
      console.error('Error getting organization details:', error.message);
      res.status(500).json({ error: 'Server error', details: error.message });

  }
}

// UserController.js


  // UserController.js

async getOrganizationUsers(req, res) {
  try {
    const { organizationId } = req.params;
     // Debug log

    const users = await this.userService.getOrganizationUsers(organizationId);
    
    if (!users || users.length === 0) {
      return res.status(200).json({ 
        users: [],
        message: "No users found for this organization" 
      });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error in getOrganizationUsers:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message 
    });
  }
}

async inviteUser(req, res) {
  try {
    const { email, organizationId } = req.body;
    
    // Call static method directly on UserService
    const organizationCode = await UserService.getOrganizationCode(organizationId);

    // Send email
    await EmailService.sendInvitationEmail(email,organizationId);

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
}


  async updateUserRole(req, res) {
    try {
      const { userId, userTypeId } = req.body;
      await this.userService.updateUserRole(userId, userTypeId);
      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error.message);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      await UserService.deleteUser(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }

   async getOrganizationByUserId(req, res) {
    try {
      const { userId } = req.params;
      const organizationId = await UserService.getOrganizationIdByUserId(userId);
      res.status(200).json({ organizationId });
    } catch (error) {
      console.error('Error fetching organization ID:', error);
      res.status(500).json({ error: 'Failed to fetch organization ID' });

    }
  }
  
  
}

module.exports = new UserController(); // Export an instance of the class
// Export an instance of the UserController

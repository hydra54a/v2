const request = require('supertest');
const app = require('../index'); // Adjust the path as needed

// Mock the getKnex function
jest.mock('../db/getKnex', () => {
  const mockKnex = jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockResolvedValue([1]),
    update: jest.fn().mockResolvedValue(1), 
  });
  return jest.fn(() => mockKnex);
});


const getKnex = require('../db/getKnex');

describe('Create Account API', () => {
  let knex;

  beforeEach(() => {
    knex = getKnex();
    jest.clearAllMocks();
  });

  test('POST /account/create-account - success', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'password123',
      firstname: 'John',
      lastname: 'Doe'
    };

    knex().where().first.mockResolvedValue(null); // User doesn't exist
    knex().insert.mockResolvedValue([1]); // Mocking successful insert

    const response = await request(app)
      .post('/account/create-account')
      .send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Account created successfully');
    expect(response.body).toHaveProperty('userId');
    expect(knex().insert).toHaveBeenCalled();
  });

  test('POST /account/create-account - email already in use', async () => {
    const mockUser = {
      email: 'existing@example.com',
      password: 'password123',
      firstname: 'Jane',
      lastname: 'Doe'
    };

    knex().where().first.mockResolvedValue({ id: 1 }); // User already exists

    const response = await request(app)
      .post('/account/create-account')
      .send(mockUser);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('error', 'Email already in use');
      
    expect(knex().insert).not.toHaveBeenCalled();
  });
});

describe('Organization Setup and Join API', () => {
    beforeEach(() => {
      knex = getKnex();
      jest.clearAllMocks();
    });
  
    test('POST /complete-organization-setup - success', async () => {
      const mockOrganizationData = {
        userId: 1,
        organizationName: 'Test Org',
        organizationType: 1,
        industry: 'Tech',
        roleInCompany: 'Manager',
        phoneNumber: '1234567890',
        primaryAddress: '123 Test St',
        audience: 'Everyone',
        painPoints: 'None',
        startingPoint: 'Beginning',
        responsibilities: 'All',
        goals: ['Goal 1', 'Goal 2'],
      };
  
      knex().where().first.mockResolvedValueOnce({ id: 1 }); // User exists
      knex().where().first.mockResolvedValueOnce({ id: 1 }); // Organization type exists
      knex().insert.mockResolvedValue([1]); // Mocking successful inserts
  
      const response = await request(app)
        .post('/account/complete-organization-setup')
        .send(mockOrganizationData);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Organization setup complete');
      expect(response.body).toHaveProperty('orgId');
    });
  
    test('POST /join-organization - success', async () => {
      const mockJoinData = {
        userId: 1,
        organizationCode: '123456',
      };
  
      knex().where().first.mockResolvedValue({ id: 1 }); // Organization exists
      knex().insert.mockResolvedValue([1]); // Mocking successful inserts
  
      const response = await request(app)
        .post('/account/join-organization')
        .send(mockJoinData);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'User added to organization');
      expect(response.body).toHaveProperty('organizationId');
    });
  
    test('POST /create-account-without-code - success', async () => {
      const mockData = {
        userId: 1,
      };
  
      knex().where().first.mockResolvedValue({ id: 1 }); // User exists
      knex().insert.mockResolvedValue([1]); // Mocking successful insert
  
      const response = await request(app)
        .post('/account/create-account-without-code')
        .send(mockData);
  
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Account created with read-only access');
        
      expect(response.body).toHaveProperty('userId');
    });
  
    // Add more test cases for error scenarios
    test('POST /complete-organization-setup - user not found', async () => {
      const mockOrganizationData = {
        userId: 999, // Non-existent user
        organizationName: 'Test Org',
        // ... other required fields
      };
    
      knex().where().first.mockResolvedValue(null); // User doesn't exist
    
      const response = await request(app)
        .post('/account/complete-organization-setup')
        .send(mockOrganizationData);
    
      expect(response.statusCode).toBe(404);  // Expecting 404 when user not found
      expect(response.body).toHaveProperty('error', 'User not found');
    });
    
  
    test('POST /account/create-account - missing fields', async () => {
      const invalidUser = {
        email: 'invalid@example.com',
        password: 'password123',  // Missing firstname and lastname
      };
    
      const response = await request(app)
        .post('/account/create-account')
        .send(invalidUser);
    
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'All fields are required');
    });

    test('POST /account/join-organization - invalid organization code', async () => {
      const mockJoinData = {
        userId: 1,
        organizationCode: 'invalid-code',  // Invalid organization code
      };
    
      knex().where().first.mockResolvedValue(null);  // Mocking that the organization code does not exist
    
      const response = await request(app)
        .post('/account/join-organization')
        .send(mockJoinData);
    
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Organization not found');
    });
    
    
  });
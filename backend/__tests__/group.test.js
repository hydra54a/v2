const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const config = require('../config');

// mock getKnex function -> mocked knex instance w/ mocked queries
jest.mock('../db/getKnex', () => {
    const mockKnex = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        first: jest.fn(),
        insert: jest.fn().mockReturnValue({
            onConflict: jest.fn().mockReturnValue({
              merge: jest.fn().mockResolvedValue(1),
            }),
          }),
        select: jest.fn(),
        onConflict: jest.fn().mockReturnThis(),
        merge: jest.fn().mockResolvedValue(1),
        join: jest.fn().mockReturnThis(),
        update: jest.fn(),
    });
    return jest.fn(() => mockKnex);
});


const getKnex = require('../db/getKnex');

describe('Group API Tests', () => {
    let token; // Variable to hold JWT for authenticated requests
    let knex; // Variable to hold the mocked Knex instance

    beforeAll(() => {
        token = jwt.sign({ id: 'testUserId' }, config.jwtSecret, { expiresIn: '1h' });
        jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log output
    });

    beforeEach(() => {
        knex = getKnex(); // Get the mocked Knex instance for each test
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('GET /groups/allGroups - returns org id & name (based on user id in token)', async () => {
        // mock return vals
        const mockOrganizationId = 1;
        const mockGroupName = 'Test Group';
        
        // knex calls
        knex().where.mockReturnThis();
        knex().select.mockReturnThis();
        knex().first.mockResolvedValueOnce({ organization_id: mockOrganizationId });
        knex().first.mockResolvedValueOnce({ name: mockGroupName });
        
        // expected response
        const expectedResponse = {
            organizationId: mockOrganizationId,
            name: mockGroupName
        };
        
        // call endpoint
        const response = await request(app)
            .get('/groups/allGroups')
            .set('Authorization', `Bearer ${token}`);
        
        // check response & calls
        expect(response.body).toEqual(expectedResponse);
        expect(knex().select).toHaveBeenCalled();
        expect(knex().first).toHaveBeenCalled();
    });
    


    test('GET /groups/allEmails/:organizationId - should return all group emails', async () => {
        //mock return vals
        const organizationId = "3";
        const mockEmails = ['user1@example.com', 'user2@example.com'];
        
        // knex calls
        knex().where.mockReturnThis();
        knex().join.mockReturnThis();
        knex().select.mockResolvedValueOnce(mockEmails.map(email => ({ email })));
    
        // call endpoint
        const response = await request(app)
            .get(`/groups/allEmails/${organizationId}`)
            .set('Authorization', `Bearer ${token}`);
        
        // expected response & calls
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEmails.join(',')); 
        expect(knex().where).toHaveBeenCalledWith({ organization_id: organizationId });
        expect(knex().join).toHaveBeenCalledWith('Users', 'UserOrganizations.user_id', 'Users.id');
    });
    

    test('GET /groups/:organizationId - should return group details by organization ID', async () => {
        const organizationId = 38; // Use a valid organization ID
        const mockGroupDetails = { id: 1, name: 'Test Group', organization_id: organizationId };

        knex().where.mockReturnThis(); // Ensure that 'where' returns the mockKnex instance
        knex().where.mockImplementation(() => ({
            select: jest.fn().mockResolvedValueOnce([mockGroupDetails]) // Mock response for select
        }));

        const response = await request(app)
            .get(`/groups/${organizationId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockGroupDetails]); // Check the response body
    });

    test('POST /groups/create - should create or update a group', async () => {
        const groupData = {
            organization_id: '16',
            name: 'Test Group',
            subgroups: [],
            user_emails: [],
            form_type: 'someType'
        };

        knex().where.mockReturnThis();
        knex().first.mockResolvedValueOnce(null);
        knex().insert.mockReturnValue({
            onConflict: jest.fn().mockReturnValue({
                merge: jest.fn().mockResolvedValue(1), // Mock successful merge
            }),
        });

        const response = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${token}`)
            .send(groupData);
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Group created successfully'); // Adjust based on your logic
        expect(knex().insert).toHaveBeenCalledWith(expect.objectContaining(groupData)); // Check if insert was called with groupData
    });

    test('POST /groups/emails - should add users to a group', async () => {
        //mock return vals + relevant values
        const userData = {
            organization_id: 'testOrgId',
            emails: ['user1@example.com', 'user2@example.com']
        };
        const mockGroup = { id: 1, user_emails: 'user3@example.com' };
    
        // knex calls
        knex().where.mockReturnThis();
        knex().first.mockResolvedValueOnce(mockGroup);
        knex().update.mockResolvedValueOnce(1);
    
        // call endpoint
        const response = await request(app)
            .post('/groups/emails')
            .set('Authorization', `Bearer ${token}`)
            .send(userData);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Users added to group successfully');
        expect(knex().update).toHaveBeenCalled();
    });

    test('POST /groups/create - should handle duplicate group creation', async () => {
        const groupData = {
            organization_id: '16',
            name: 'Test Group',
            subgroups: [],
            user_emails: [],
            form_type: 'someType'
        };

        knex().where.mockReturnThis(); // Mock where to chain
        knex().first.mockResolvedValueOnce({ id: 1 }); // Simulate that a group already exists

        const response = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${token}`)
            .send(groupData);

        expect(response.body.message).toBe('Group with this name already exists'); // Adjust based on your logic
    });
});

const request = require('supertest');
const app = require('../index');

jest.mock('../db/getKnex', () => {
  const mockKnex = jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    whereIn: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockResolvedValue([1]),
    select: jest.fn(), 
  });
  return jest.fn(() => mockKnex);
});

const getKnex = require('../db/getKnex');

describe('Search API', () => {
  let knex;

  beforeEach(() => {
    knex = getKnex();
    jest.clearAllMocks();
  });

  test('GET /search/events - success', async () => {
    const mockEvents = [{ id: 1, name: 'Test Event' }];
    knex().select.mockResolvedValueOnce(mockEvents);

    const response = await request(app)
      .get('/search/events');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockEvents); 
    expect(knex().select).toHaveBeenCalled();
  });

  test('POST /search/event-types - success', async () => {
    const mockEventTypes = ['type1', 'type2'];

    knex().select.mockResolvedValueOnce([
      { event_type_id: 1 },
      { event_type_id: 2 },
    ]);

    knex().select.mockResolvedValueOnce([
      { id: 1, event_type: 'type1' },
      { id: 2, event_type: 'type2' },
    ]);

    const response = await request(app)
      .post('/search/event-types')
      .send({id: 1});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockEventTypes); 
    expect(knex('MapEventTypes').select).toHaveBeenCalledWith('*');
    expect(knex('EventTypes').select).toHaveBeenCalledWith('*');
  });
});
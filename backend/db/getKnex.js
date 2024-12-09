let knexInstance;

if (process.env.NODE_ENV === 'test') {
  // Return a mock function for testing
  knexInstance = jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockResolvedValue([1]),
  });
} else {
  // Use actual Knex for non-test environments
  const environment = process.env.NODE_ENV || 'development';
  const config = require('../knexfile')[environment];
  knexInstance = require('knex')(config);
}

module.exports = () => knexInstance;
const { sendPasswordResetEmail, verifyResetCode, resetUserPassword } = require('../services/authService');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');// Mock the database (db) function with necessary chainable methods
jest.mock('../services/db', () => {
    const knexMock = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      first: jest.fn(),
      update: jest.fn().mockResolvedValue(1),
      fn: { now: jest.fn(() => new Date()) },
    };    return jest.fn(() => knexMock);
  });jest.mock('bcryptjs');
jest.mock('nodemailer');const db = require('../services/db');describe('authService - Password Reset', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });  describe('sendPasswordResetEmail', () => {
    it('should send a reset email with a valid token', async () => {
      db().where().first.mockResolvedValue({ email: 'test@example.com' });
      const sendMail = jest.fn().mockResolvedValue(true);
      nodemailer.createTransport.mockReturnValue({ sendMail });      await sendPasswordResetEmail('test@example.com');      expect(sendMail).toHaveBeenCalledTimes(1);
      expect(sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Password Reset Request',
        })
      );
    });    it('should throw an error if email is not found', async () => {
      db().where().first.mockResolvedValue(null);      await expect(sendPasswordResetEmail('invalid@example.com')).rejects.toThrow('Email not found');
    });
  });  describe('verifyResetCode', () => {
    it('should verify a valid reset code', async () => {
      db().where().first.mockResolvedValue({
        reset_token: '123456',
        reset_token_expires: new Date(Date.now() + 10000),
      });      const result = await verifyResetCode('123456');
      expect(result).toHaveProperty('resetToken', '123456');
    });    it('should return null for expired or invalid code', async () => {
      db().where().first.mockResolvedValue(null);      const result = await verifyResetCode('invalid_code');
      expect(result).toBeNull();
    });
  });  describe('resetUserPassword', () => {
    it('should reset the password when given a valid token', async () => {
      db().where().first.mockResolvedValue({ reset_token_expires: new Date(Date.now() + 10000) });
      bcrypt.hash.mockResolvedValue('hashedPassword');      const result = await resetUserPassword('123456', 'newPassword');
      expect(result).toBe(true);
      expect(db().update).toHaveBeenCalled();
    });    it('should return false for an expired token', async () => {
      db().where().first.mockResolvedValue({ reset_token_expires: new Date(Date.now() - 10000) });      const result = await resetUserPassword('expired_token', 'newPassword');
      expect(result).toBe(false);
    });
  });
});
const request = require('supertest');
const app = require('../index');
const { sendPasswordResetEmail, verifyResetCode, resetUserPassword } = require('../services/authService');

jest.mock('../services/authService');

describe('Password Reset Routes', () => {

  describe('POST /reset-password', () => {
    it('should respond with 200 if email is provided and valid', async () => {
      sendPasswordResetEmail.mockResolvedValueOnce();

      const response = await request(app)
        .post('/reset-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset email sent.');
    });

    it('should respond with 400 if email is missing', async () => {
      const response = await request(app)
        .post('/reset-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email is required.');
    });

    it('should respond with 500 if service throws an error', async () => {
      sendPasswordResetEmail.mockRejectedValueOnce(new Error('Service error'));

      const response = await request(app)
        .post('/reset-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Service error');
    });
  });

  describe('POST /verify-reset-code', () => {
    it('should respond with 200 if reset code is valid', async () => {
      verifyResetCode.mockResolvedValueOnce({ resetToken: '123456' });

      const response = await request(app)
        .post('/verify-reset-code')
        .send({ code: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Code verified');
    });

    it('should respond with 400 if reset code is invalid', async () => {
      verifyResetCode.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/verify-reset-code')
        .send({ code: 'invalid_code' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired code');
    });

    it('should respond with 500 if service throws an error', async () => {
      verifyResetCode.mockRejectedValueOnce(new Error('Service error'));

      const response = await request(app)
        .post('/verify-reset-code')
        .send({ code: '123456' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Service error');
    });
  });

  describe('POST /set-new-password', () => {
    it('should respond with 200 if password reset is successful', async () => {
      resetUserPassword.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/set-new-password')
        .send({ resetToken: '123456', newPassword: 'newPassword' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password has been updated successfully.');
    });

    it('should respond with 400 if reset token is invalid or expired', async () => {
      resetUserPassword.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/set-new-password')
        .send({ resetToken: 'invalid_token', newPassword: 'newPassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Failed to update password. Invalid or expired reset token.');
    });

    it('should respond with 500 if service throws an error', async () => {
      resetUserPassword.mockRejectedValueOnce(new Error('Service error'));

      const response = await request(app)
        .post('/set-new-password')
        .send({ resetToken: '123456', newPassword: 'newPassword' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Service error');
    });
  });

});

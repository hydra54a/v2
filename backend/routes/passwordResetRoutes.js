const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { sendPasswordResetEmail, verifyResetCode, resetUserPassword } = require('../services/authService');

// POST route for password reset email
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    await sendPasswordResetEmail(email);
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST route to resend the reset code
router.post('/resend-reset-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    await sendPasswordResetEmail(email); // Send a new reset code
    res.status(200).json({ message: 'A new reset code has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to resend reset code. Please try again later.' });
  }
});

// POST route to verify the reset code
router.post('/verify-reset-code', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required.' });
  }

  try {
    const isValid = await verifyResetCode(code);
    if (isValid) {
      const user = await db('Users').where({ reset_token: code }).first();
      res.status(200).json({ message: 'Code verified', resetToken: user.reset_token }); 
    } else {
      res.status(400).json({ message: 'Invalid or expired code' });
    }
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ message: 'An error occurred while verifying the code.' });
  }
});


router.post('/set-new-password', async (req, res) => {
  const { newPassword, resetToken } = req.body;

  if (!newPassword || !resetToken) {
    return res.status(400).json({ message: 'Code and new password are required.' });
  }

  try {
    const success = await resetUserPassword(resetToken, newPassword);
    if (success) {
      res.status(200).json({ message: 'Password has been updated successfully.' });
    } else {
      res.status(400).json({ message: 'Failed to update password. Invalid or expired reset token.' });
    }
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'An error occurred while resetting the password.' });
  }
});

module.exports = router;

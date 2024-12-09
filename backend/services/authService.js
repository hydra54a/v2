const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');

// Function to handle user login
async function loginUser(email, password) {
  try {
    const user = await db('Users').where({ email }).first();
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.pwd);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });
    await db('Users').where({ id: user.id }).update({ updated_at: db.fn.now() });

    return { token };
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    throw error;
  }
}

// Function to send password reset email
async function sendPasswordResetEmail(email) {
  try {
    const user = await db('Users').where({ email }).first();
    if (!user) {
      throw new Error('Email not found');
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit numeric code
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1); // Token expires in 1 hour

    // Store token and expiration in the database
    await db('Users')
      .where({ email })
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresIn,
      });

    

    // Configure and send the email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following code: ${resetToken}. This code will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error.message);
    throw error;
  }
}

// Function to verify the reset code
async function verifyResetCode(code) {
  try {
    const user = await db('Users')
      .where({ reset_token: code })
      .andWhere('reset_token_expires', '>', new Date()) // Ensure token hasn't expired
      .first();

    if (user) {
      
      return { resetToken: user.reset_token };
    } else {
      
      return null;
    }
  } catch (error) {
    console.error('Error in verifyResetCode:', error.message);
    throw error;
  }
}

// Function to reset user password
async function resetUserPassword(resetToken, newPassword) {
  try {
    // Log the reset token to verify it's being passed correctly
    

    // Retrieve the user with the given reset token
    const user = await db('Users').where({ reset_token: resetToken }).first();

    // If no user is found or the token has expired, log an error and return false
    if (!user) {
      
      return false;
    }

    // Log the token expiration time for debugging
    
    console.log('Current time:', new Date());

    // If the token has expired, log an error and return false
    if (new Date() > user.reset_token_expires) {
      
      return false;
    }

    // If token is valid, hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    await db('Users')
      .where({ reset_token: resetToken })
      .update({
        pwd: hashedPassword,
        reset_token: null, // Clear the reset token once used
        reset_token_expires: null, // Clear the expiration
        updated_at: db.fn.now(),
      });

    // Log success
    
    return true;
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in resetUserPassword:', error.message);
    throw error;
  }
}


module.exports = {
  loginUser,
  sendPasswordResetEmail,
  verifyResetCode,
  resetUserPassword,
};

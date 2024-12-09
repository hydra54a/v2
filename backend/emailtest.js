require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');

// Function to send a test email
async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: 'dipenbaps12@gmail.com', // Recipient email (use a valid email for testing)
      subject: 'Test Email from Nodemailer', 
      text: 'This is a test email to ensure Nodemailer is working.', 
    };

    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

// Call the function to send the email
sendTestEmail();


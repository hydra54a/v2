const nodemailer = require('nodemailer');
const UserRepository = require('../repositories/UserRepository'); // Assuming you have a UserRepository to query organization details

class EmailService {
  static async sendInvitationEmail(toEmail, organizationCode) {
    // Configure your SMTP transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose the email content
    const emailContent = `
      <p>Dear Future Team Member,</p>
      <p>You've been invited to join <strong>${organizationName}</strong> on our CRM platform!</p>
      <p><strong>To get started:</strong></p>
      <ol>
        <li>Visit: <a href="http://localhost:5173/signup">http://localhost:5173/signup</a></li>
        <li>Use this organization code when prompted for: <strong>${organizationCode}</strong></li>
        <li>Complete your profile</li>
      </ol>
      <p>If you have any questions, please contact your administrator.</p>
      <p>Best regards,</p>
      <p>The CRM Team</p>
    `;

    // Define the mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to Join ${organizationName}`,
      html: emailContent,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      
      return true;
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }
}

module.exports = EmailService;

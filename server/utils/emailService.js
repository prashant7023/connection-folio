const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email to admin about new student registration
 * @param {Object} studentData - The student data from registration
 * @param {String} adminEmail - The admin email to send notification to
 * @returns {Promise} - Email sending result
 */
const sendNewStudentNotification = async (studentData, adminEmail) => {
  try {
    console.log(`🔄 Attempting to send email to admin at: ${adminEmail}`);
    
    // Get status color
    const getStatusColor = (status) => {
      switch(status) {
        case 'active': return '#4CAF50';
        case 'pending': return '#FF9800';
        case 'inactive': return '#F44336';
        default: return '#757575';
      }
    };
    
    // Get status badge
    const getStatusBadge = (status) => {
      return `<span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; background-color: ${getStatusColor(status)}; text-transform: uppercase;">${status}</span>`;
    };
    
    // Format the student data for email with improved styling
    const studentInfo = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Student Registration</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eaeaea;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1a365d;
          }
          .title {
            color: #1a365d;
            margin-top: 0;
          }
          .info-section {
            margin-top: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 10px;
          }
          .info-label {
            width: 150px;
            font-weight: bold;
            color: #555;
          }
          .info-value {
            flex: 1;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
          }
          .button {
            display: inline-block;
            background-color: #1a365d;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
          }
          .notification-bar {
            background-color: #1a365d;
            color: white;
            text-align: center;
            padding: 10px;
            border-radius: 8px 8px 0 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="notification-bar">
            <strong>🔔 New Student Registration Alert</strong>
          </div>
          <div class="header">
            <div class="logo">Connection Folio</div>
            <p>Student Management System</p>
          </div>
          
          <h2 class="title">New Student Registration</h2>
          <p>A new student has registered and is awaiting approval.</p>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${studentData.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value"><a href="mailto:${studentData.email}" style="color: #3182ce;">${studentData.email}</a></div>
            </div>
            <div class="info-row">
              <div class="info-label">Roll Number:</div>
              <div class="info-value">${studentData.rollNo}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Batch:</div>
              <div class="info-value">${studentData.batch}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Branch:</div>
              <div class="info-value">${studentData.branch}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Registration Time:</div>
              <div class="info-value">${new Date(studentData.createdAt).toLocaleString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">${getStatusBadge(studentData.status)}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/admin" class="button">Review in Admin Panel</a>
          </div>
          
          <div class="footer">
            <p>This is an automated message from Connection Folio. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Connection Folio. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const msg = {
      to: adminEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'notifications@connectionfolio.com',
      subject: '🎓 New Student Registration - Connection Folio',
      html: studentInfo,
    };

    // Send email
    await sgMail.send(msg);
    console.log('✉️ Email sent successfully to admin');
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return false;
  }
};

module.exports = {
  sendNewStudentNotification
}; 
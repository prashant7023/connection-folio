const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

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
            <a href="https://connection-folio.vercel.app/admin" class="button">Review in Admin Panel</a>
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
    const mailOptions = {
      from: '"Connection Folio System" <prashantsh123@gmail.com>',
      to: adminEmail,
      subject: '🎓 New Student Registration - Connection Folio',
      html: studentInfo,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email sent successfully to admin:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

/**
 * Send approval confirmation email to student
 * @param {Object} studentData - The student data with approval status
 * @returns {Promise} - Email sending result
 */
const sendStudentApprovalEmail = async (studentData) => {
  try {
    console.log(`🔄 Sending approval confirmation to student: ${studentData.email}`);
    
    // Get status details
    const getStatusDetails = (status) => {
      switch(status) {
        case 'active': 
          return {
            color: '#4CAF50',
            icon: '✅',
            title: 'Account Approved',
            message: 'Your account has been approved. You can now log in and access all features.'
          };
        case 'inactive': 
          return {
            color: '#F44336',
            icon: '❌',
            title: 'Account Rejected',
            message: 'Your account has been rejected. Please contact the administration for more information.'
          };
        case 'pending':
          return {
            color: '#FF9800',
            icon: '⏳',
            title: 'Account Pending',
            message: 'Your account is pending review. We will notify you when it is approved.'
          };
        default: 
          return {
            color: '#757575',
            icon: 'ℹ️',
            title: 'Account Status Update',
            message: 'Your account status has been updated.'
          };
      }
    };
    
    const statusInfo = getStatusDetails(studentData.status);
    
    // Format the email with styling
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Status Update</title>
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
          .status-icon {
            font-size: 48px;
            margin: 20px 0;
          }
          .title {
            color: ${statusInfo.color};
            margin-top: 0;
            font-size: 24px;
          }
          .message {
            font-size: 16px;
            margin: 20px 0;
          }
          .details {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-row {
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
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
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
          }
          .notification-bar {
            background-color: ${statusInfo.color};
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
            <strong>${statusInfo.icon} ${statusInfo.title}</strong>
          </div>
          <div class="header">
            <div class="logo">Connection Folio</div>
            <p>Student Management System</p>
          </div>
          
          <div style="text-align: center;">
            <div class="status-icon">${statusInfo.icon}</div>
            <h2 class="title">${statusInfo.title}</h2>
            <p class="message">${statusInfo.message}</p>
          </div>
          
          <div class="details">
            <div class="info-row">
              <span class="info-label">Name:</span> ${studentData.name}
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> ${studentData.email}
            </div>
            <div class="info-row">
              <span class="info-label">Roll Number:</span> ${studentData.rollNo}
            </div>
            <div class="info-row">
              <span class="info-label">Batch:</span> ${studentData.batch}
            </div>
            <div class="info-row">
              <span class="info-label">Branch:</span> ${studentData.branch}
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span> <span style="color:${statusInfo.color};font-weight:bold;text-transform:uppercase;">${studentData.status}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://connection-folio.vercel.app/profile" class="button">Go to Your Profile</a>
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
    const mailOptions = {
      from: `"Connection Folio System" <${process.env.GMAIL_USER}>`,
      to: studentData.email,
      subject: `🎓 Your Connection Folio Account is ${studentData.status === 'active' ? 'Approved' : 
                 studentData.status === 'inactive' ? 'Rejected' : 'Updated'}`,
      html: emailContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Status update email sent to student ${studentData.email}:`, info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Student email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendNewStudentNotification,
  sendStudentApprovalEmail
}; 
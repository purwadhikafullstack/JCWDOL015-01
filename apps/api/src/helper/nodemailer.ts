import nodemailer from 'nodemailer';

export const sendDeveloperNotification = async (developerEmail: string) => {
  try {
    // Create the transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Using Gmail as an example
      auth: {
        user: process.env.MAIL_USER, // Your email address
        pass: process.env.MAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER, // Sender email
      to: developerEmail, // Developer's email
      subject: 'User Completed Assessment', // Email subject
      text: 'A user has completed the assessment. Please review their results.', // Email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully.');
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
};

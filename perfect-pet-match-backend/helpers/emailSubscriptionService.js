const nodemailer = require('nodemailer');
const validator = require('validator');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to validate email address
function isValidEmail(email) {
    // Implement email validation logic 
    return validator.isEmail(email);
}

// Function to check if email is already subscribed
async function checkIfSubscribed(email) {
    // Check if the provided email is in the list of subscribed emails
    const isSubscribed = subscribedEmails.includes(email);
    if (isSubscribed) {
        return true;
    } else {
        return false;
    }
}

async function sendConfirmationEmail(email) {
    await transporter.sendMail({
        from: 'email',
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing for updates!'
    });
}

module.exports = { transporter, sendConfirmationEmail };
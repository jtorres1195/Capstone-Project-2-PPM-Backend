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

// Function to add email to subscription list
async function addToSubscriptionList(email) {
    // Check if email is already subscribed
    const isSubscribed = await checkIfSubscribed(email);

    // If not already subscribed, add the email to the list
    if (!isSubscribed) {
        subscribedEmails.push(email);
    }
    // Return whether the email was successfully added
    return !isSubscribed;
}

async function sendConfirmationEmail(email) {
    await transporter.sendMail({
        from: 'email',
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing for updates!'
    });
}

// Function to add email to subscription list
async function addToSubscriptionList(email) {
    try {
        // Check if the email is already subscribed
        const isSubscribed = await checkIfSubscribed(email);

        // If not already subscribed, insert the email into the database
        if (!isSubscribed) {
            const query = 'INSERT INTO subscribed_emails (email) VALUES ($1)';
            await db.query(query, [email]);
        }

        // Return whether the email was successfully added
        return !isSubscribed;
    } catch (error) {
        console.error('Error adding email to subscription list:', error);
        throw error;
    }
}

async function removeFromSubscriptionList(email) {
    try {
        // Remove the email from the database
        const query = 'DELETE FROM subscribed_emails WHERE email = $1';
        await db.query(query, [email]);
    } catch (error) {
        console.error('Error removing email from subscription list', error);
        throw error;
    }
}

module.exports = { transporter, sendConfirmationEmail };
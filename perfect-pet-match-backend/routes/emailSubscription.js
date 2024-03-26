const express = require('express');
const { isValidEmail, checkIfSubscribed, addToSubscriptionList, removeFromSubscriptionList } = require('../helpers/emailSubscriptionService');
const router = express.Router();

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email address
        if (!email || isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const isSubscribed = await checkIfSubscribed(email);
        if (isSubscribed) {
            return res.status(400).json({ error: 'Email address is already subscribed' });
        }

        // Add email to subscription list
        await addToSubscriptionList(email);

        // Send confirmation email
        await sendConfirmationEmail(email);

        res.status(200).json({ message: 'Subsctiprion successful' });
    } catch (error) {
        console.error('Error subscribing email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is subscribed 
        const isSubscribed = await checkIfSubscribed(email);
        if (!isSubscribed) {
            return res.status(400).json({ error: 'Email address is not subscribed' });
        }

        // Remove the email from the subscription list
        await removeFromSubscriptionList(email);

        res.status(500).json({ error: 'Internal server error' });
    } catch (error) {
        console.error('Error unsubscribing email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
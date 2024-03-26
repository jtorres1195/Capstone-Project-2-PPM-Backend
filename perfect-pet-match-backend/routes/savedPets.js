const express = require('express');
const { verifyToken } = require('../helpers/authHelper');
const User = require('../models/User');
const router = express.Router();

// Retrieve user's saved pets
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        // Retrieve user's saved pets from the database
        const savedPets = await User.fetchSavedPets(userId);
        res.json({ message: 'Saved Pets', savedPets: savedPets });
    } catch (error) {
        console.error('Error retrieving saved pets:', error);
        res.status(500).json({ message: 'Error retrieving saved pets' });
    }
});

module.exports = router;

const express = require('express');
const { verifyToken } = require('../helpers/authHelper');
const User = require('../models/User');
const router = express.Router();

// Retrieve user's favorite pets
router.get('/:id/favorite', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const petId = req.params.petId;

        // Add the pet to the user's favorites
        await User.favoritePet(userId, petId);

        res.json({ message: 'Pet favorited successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
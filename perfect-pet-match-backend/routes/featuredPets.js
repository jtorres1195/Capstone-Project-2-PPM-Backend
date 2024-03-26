const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const { fetchFeaturedPets, updateFeaturedPetsinDatabase } = require('../helpers/petService');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const petApiToken = req.access_token;
        const featuredPets = await fetchFeaturedPets(petApiToken);

        // Update the database with the new featured pets
        await updateFeaturedPetsinDatabase(featuredPets);

        res.json(featuredPets);
    } catch (error) {
        console.error('Error fetching or updating featured pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

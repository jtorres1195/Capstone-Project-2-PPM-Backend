const express = require('express');
const { updateFeaturedPetsinDatabase } = require('../helpers/petService');
const PetFinderAPI = require('../helpers/apiHelper');
const router = express.Router();

const petFinderAPI = new PetFinderAPI();

router.get('/', async (req, res) => {
    try {
        const featuredPets = await petFinderAPI.fetchFeaturedPets();
        console.log("Featured Pets:", featuredPets);

        res.json(featuredPets);
    } catch (error) {
        console.error('Error fetching or updating featured pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

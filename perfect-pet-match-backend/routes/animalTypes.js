const express = require('express');
const PetFinderAPI = require('../helpers/apiHelper'); 
const router = express.Router();

const petFinderAPI = new PetFinderAPI();

// Get animal types
router.get('/', async (req, res) => {
    try {
        const animalTypes = await petFinderAPI.fetchAnimalTypes();
        console.log("Animal Types:", animalTypes);
        res.json({ animalTypes });
    } catch (error) {
        console.error('Error fetching animal types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
const express = require('express');
const Pets = require('../models/Pets');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Route to perform search and filtering
router.get('/', async (req, res) => {
    try {
        // Extract criteria from query parameters from the perfect pet match database
        const { species, age, color, breed } = req.query;
        // Construct search query based on criteria
        const searchQuery = {};

        if (species) {
            searchQuery.species = species;
        }
        if (age) {
            searchQuery.age = age;
        }
        if (color) {
            searchQuery.color;
        }
        if (breed) {
            searchQuery.breed = breed;
        }

        // Query the database with the constructed search query
        const searchResults = await Pets.find(searchQuery);

        // Return the search results
        res.json({ results: searchResults });
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to make a search request to the Pet Finder API
router.get('/api/pets/search', authenticateToken, async (req, res) => {
    try {
        const { location, breed, age, size, gender } = req.query;

        // Construct query parameters for the Pet Finder API
        const queryParams = {};
        if (location) queryParams.location = location;
        if (breed) queryParams.breed = breed;
        if (age) queryParams.age = age;
        if (size) queryParams.size = size;
        if (gender) queryParams.gender = gender;

        // Make a request to the Pet Finder API with the constructed query parameters
        const petApiToken = req.access_token;
        const response = await axios.get('https://api.petfinder.com/v2/animals', {
            params: queryParams,
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });

        if (response.status === 200 && response.data && response.data.animals) {
            const animals = response.data.animals;
            res.json(animals);
        } else {
            console.error('Unexpected response from PetFinder API:', response.data);
            res.status(500).json({ message: 'Unexpected response from PetFinder API' });
        }
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to filter search results
router.get('/filter', async (req, res) => {
    try {
        const { age, size, gender } = req.query;
        const filter = {};

        if (age) {
            const [minAge, maxAge] = age.split('-');
            filter.age = {$gte: minAge, $lte: maxAge };
        }
        if (size) {
            filter.size = size;
        }
        if (gender) {
            filter.gender = gender;
        }

        const filteredPets = await Pets.find(filter);

        res.json({ filteredPets });
    } catch (error) {
        console.error('Error filtering pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
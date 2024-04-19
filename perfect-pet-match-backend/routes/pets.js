const express = require('express');
const PetFinderAPI = require('../helpers/apiHelper');
const router = express.Router();

const petFinderAPI = new PetFinderAPI();

// Retrieve a list of pets with optional type filtering
router.get('/', async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;
    const validTypes = ['dog', 'cat', 'rabbit', 'bird', 'small&furry', 'horse', 'scales,fins&other', 'barnyard'];

    // Validate type if provided
    if (type && !validTypes.includes(type.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid animal type. Valid types include: dog, cat, rabbit, etc.' });
    }

    try {
        let petsData;
        if (type) {
            // Fetch pets by specific type
            petsData = await petFinderAPI.fetchAnimalByType(type, page, limit);
        } else {
            // Fetch all pets if no type is specified
            petsData = await petFinderAPI.fetchPets(page, limit);
        }

        // Check if there are any animals returned
        if (!petsData.animals.length) {
            return res.status(404).json({ message: 'No animals found for the specified type.' });
        }

        // Send the response with animals data
        res.json(petsData);
    } catch (error) {
        console.error(`Failed to fetch pets${type ? ' of type ' + type : ''}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

// Retrieve a specific pet by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const petDetails = await petFinderAPI.fetchPetById(id);
        res.json(petDetails);
    } catch (error) {
        console.error(`Failed to fetch pet details for ID ${id}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

// Retrieve pet photos
router.get('/:id/photos', async (req, res) => {
    const { id } = req.params;

    try {
        const petPhotos = await petFinderAPI.fetchPetPhotos(id);
        res.json(petPhotos);
    } catch (error) {
        console.error('Error fetching pet photos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;

const express = require('express');
const { isAdmin } = require('../middleware/isAdmin');
const { authenticateToken } = require('../middleware/auth');
const Pets = require('../models/Pets');
const axios = require('axios');
const router = express.Router();

// Retrieve a list of pets 
router.get('/', authenticateToken, async (req, res) => {
    try {
        const petApiToken = req.access_token;
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 20 pets per page if not provided
        const offset = (page - 1) * limit;
        const response = await axios.get(`https://api.petfinder.com/v2/animals?page=${page}&offset=${offset}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });

        if (response.status === 200 && response.data && response.data.animals) {
            const pets = response.data.animals;
            const totalCount = response.data.pagination.total_count; // Total count of pets
            const totalPages = Math.ceil(totalCount / limit);  // Calculate total pages

            // Decoding the pets.description
            const decodedDescription = decodeURIComponent(pets.description);

            res.json({ data: pets, total: totalPages, decodedDescription }); // Sending the response with 'data' and 'total' properties
        } else {
            console.error('Unexpected response from PetFinder API:', response.data);
            res.status(500).json({ message: 'Unexpected response from PetFinder API' });
        }
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve a specific pet by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const petApiToken = req.access_token;
        const { id } = req.params;
        const response = await axios.get(`https://api.petfinder.com/v2/animals/${id}`, {
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });
        if (response.status === 200 && response.data && response.data.animal) {
            const petDetails = response.data.animal;
            res.json(petDetails);
        } else {
            console.error('Unexpected response from PetFinder API:', response.data);
            res.status(500).json({ message: 'Unexpected response from PetFinder API' });
        }
    } catch (error) {
        console.error('Error fetching pet details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve pet photos
router.get('/:id/photos', authenticateToken, async (req, res) => {
    try {
        const petApiToken = req.access_token;
        const { petId } = req.params;
        const response = await axios.get(`https://api.petfinder.com/v2/animals/${petId}/photos`, {
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });
        if (response.status === 200 && response.data && response.data.photos) {
            const petPhotos = response.data.photos;
            res.json(petPhotos);
        } else {
            console.error('Unexpected response from PetFinder API:', response.data);
            res.status(500).json({ message: 'Unexpected response from PetFinder API' });
        }
    } catch (error) {
        console.error('Error fetching pet photos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new pet
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, age, species } = req.body;
        const newPet = await Pets.createPet(name, age, species);
        res.status(201).json(newPet);
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a pet
router.put('/:id/update', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, species } = req.body;
        const updatedPet = await Pets.updatePet(id, { name, age, species });
        res.json(updatedPet);
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a pet
router.delete('/:id/delete', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Pets.deletePet(id);
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get animal type
router.get('/', authenticateToken, async (req, res) => {
    const { type } = req.query;
    console.log( '###', type );
    const petTypes = ['dog', 'cat', 'rabbit', 'bird', 'small&furry', 'horse', 'scales,fins&other', 'barnyard']
    try {
        if (!petTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid animal type' });
        }

        const petApiToken = req.access_token;
        const response = await axios.get(`https://api.petfinder.com/v2/animals?type=${type}`, {
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });

        const animals = response.data.animals.filter(animal => animal.type.name.toLowerCase() === type.toLowerCase());
        console.log(animalType);

        res.json({ animalType });
    } catch (error) {
        console.error(`Error fetching dogs:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// // Get animal type: cat
// router.get('/cat', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals/?type=cat', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching cats:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// // Get animal type: rabbit
// router.get('/rabbit', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals/?type=rabbit', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching rabbits:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// // Get animal type: bird
// router.get('/bird', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals/?type=bird', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching birds:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// // Get animal type: small & furry
// router.get('/small&furry', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals?type=small%20%26%20furry', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching small & furry:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// // Get animal type: horse
// router.get('/horse', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals/?type=horse', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching horses:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// // Get animal type: scales, fins & other
// router.get('/scales,fins&other', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals?type=scales,%20fins%20%26%20other', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching scales, fins & other:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// // Get animal type: barnyard
// router.get('/barnyard', authenticateToken, async (req, res) => {
//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get('https://api.petfinder.com/v2/animals/?type=barnyard', {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const animalType = response.data;
//         console.log(animalType);

//         res.json({ animalType });
//     } catch (error) {
//         console.error(`Error fetching barnyard:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

module.exports = router;

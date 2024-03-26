const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');
const router = express.Router();

// Get animal types
router.get('/', authenticateToken, async (req, res) => {
    try {
        const petApiToken = req.access_token;
        const response = await axios.get('https://api.petfinder.com/v2/types', {
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });

        const animalTypes = response.data.types;
        console.log(animalTypes);
        res.json({ animalTypes, petApiToken });
    } catch (error) {
        console.error('Error fetching animal types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// // Get animal type breeds
// router.get('/:type/breeds', authenticateToken, async (req, res) => {
//     const { type } = req.params;

//     try {
//         const petApiToken = req.access_token;
//         const response = await axios.get(`https://api.petfinder.com/v2/types/${type}/breeds`, {
//             headers: {
//                 'Authorization': `Bearer ${petApiToken}`
//             }
//         });

//         const breeds = response.data.breeds;
//         console.log(breeds);

//         res.json({ breeds });
//     } catch (error) {
//         console.error(`Error fetching breeds for ${type}:`, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

module.exports = router;
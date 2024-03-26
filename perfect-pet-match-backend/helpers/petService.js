const cron = require('node-cron');
const db = require('../db');
const axios = require('axios');

async function fetchFeaturedPets(petApiToken) {
    try {
        const response = await axios.get('https://api.petfinder.com/v2/animals?random', {
            headers: {
                'Authorization': `Bearer ${petApiToken}`
            }
        });

        if (response.status === 200 && response.data && response.data.animals) {
            return response.data.animals;
        } else {
            console.error('Unexpected response from PetFinder API:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching featured pets:', error);
        throw error;
    }
}

async function updateFeaturedPetsinDatabase(newFeaturedPets) {
    try {
         // Iterate over the newFeaturedPets array and update the database
        for (const pet of newFeaturedPets) {
            const query = `
            INSERT INTO featured_pets (pet_id, name, species, breed, color, age, size, location, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (pet_id) DO UPDATE 
                SET name = EXCLUDED.name, 
                    species = EXCLUDED.species,  
                    breed = EXCLUDED.breed,  
                    color = EXCLUDED.color,  
                    age = EXCLUDED.age,  
                    size = EXCLUDED.size,  
                    location = EXCLUDED.location, 
                    status = EXCLUDED.status  
            `;

            const age = !isNaN(pet.age) ? parseInt(pet.age) : null;
            const params = [
                pet.id, pet.name, pet.species, pet.breed, pet.color,
                age, pet.size, pet.location, pet.status
            ];

            // Execute the query
            await db.query(query, params);
        }

        console.log('Featured pets updated in the database!');
    } catch (error) {
        console.error('Error updating featured pets in the database:', error);
        throw error;
    }
}

// Function to schedule the task
function scheduleFeaturedPetsUpdate() {
    // Schedule the task to reset featured pets every Monday at Midnight
    cron.schedule('0 0 * * 1', async () => {
        try {
            // Fetch new featured pets from the Pet Finder API
            const newFeaturedPets = await fetchFeaturedPets();

            // Update the database with the new featured pets
            await updateFeaturedPetsinDatabase(newFeaturedPets);

            console.log('Featured pets updated successfully!');
        } catch (error) {
            console.error('Error updating featured pets:', error);
        }
    }, {
        scheduled: true,
        timezone: 'America/Los_Angeles' // Set to PST timezone
    });
}


module.exports = { fetchFeaturedPets, updateFeaturedPetsinDatabase, scheduleFeaturedPetsUpdate };

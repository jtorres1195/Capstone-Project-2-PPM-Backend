const cron = require('node-cron');
const PetFinderAPI = require('../helpers/apiHelper');

const petFinderAPI = new PetFinderAPI();

function scheduleFeaturedPetsUpdate() {
    cron.schedule('0 0 * * 1', async () => {
        try {
            const newFeaturedPets = await petFinderAPI.fetchFeaturedPets();
            await updateFeaturedPetsinDatabase(newFeaturedPets);
            console.log('Featured pets updated successfully!');
        } catch (error) {
            console.error('Error updating featured pets:', error);
        }
    }, {
        scheduled: true,
        timezone: 'America/Los_Angeles'
    });
}

module.exports = { updateFeaturedPetsinDatabase, scheduleFeaturedPetsUpdate };

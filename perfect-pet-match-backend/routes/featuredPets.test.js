const request = require('supertest');
const express = require('express');
const PetFinderAPI = require('../helpers/apiHelper');
const { updateFeaturedPetsinDatabase } = require('../helpers/petService');
const featuredPetsRouter = require('../routes/featuredPetsRoutes'); 

jest.mock('../helpers/apiHelper');
jest.mock('../helpers/petService');

describe('Featured Pets Route', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(featuredPetsRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should fetch and return featured pets successfully', async () => {
            const mockFeaturedPets = [
                { id: 1, name: 'Fluffy', description: 'A fluffy cat' },
                { id: 2, name: 'Rover', description: 'A playful dog' }
            ];
            PetFinderAPI.prototype.fetchFeaturedPets.mockResolvedValue(mockFeaturedPets);
            updateFeaturedPetsinDatabase.mockResolvedValue(true);
    
            const response = await request(app).get('/');
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockFeaturedPets);
            expect(PetFinderAPI.prototype.fetchFeaturedPets).toHaveBeenCalled();
            expect(updateFeaturedPetsinDatabase).toHaveBeenCalledWith(mockFeaturedPets);
            expect(console.log).toHaveBeenCalledWith("Featured Pets:", mockFeaturedPets);
            expect(console.log).toHaveBeenCalledWith("Database update called with:", mockFeaturedPets);
        });
    
        it('should handle errors when fetching or updating featured pets', async () => {
            PetFinderAPI.prototype.fetchFeaturedPets.mockRejectedValue(new Error('Failed to fetch pets'));
            const response = await request(app).get('/');
    
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
            expect(console.error).toHaveBeenCalledWith('Error fetching or updating featured pets:', expect.any(Error));
        });
    });    
});

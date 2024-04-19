const request = require('supertest');
const express = require('express');
const PetFinderAPI = require('../helpers/apiHelper'); 
const animalTypesRouter = require('../routes/animalTypesRouter'); // Assuming this is the file where the code above is

jest.mock('../helpers/apiHelper'); // Mock the entire PetFinderAPI module

describe('GET /animal-types', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/', animalTypesRouter); // Use the router
        PetFinderAPI.mockClear(); // Clear any instances and calls to constructor and all methods
    });

    it('should return a list of animal types on successful fetch', async () => {
        const mockAnimalTypes = ['Dog', 'Cat', 'Bird'];
        PetFinderAPI.prototype.fetchAnimalTypes.mockResolvedValue(mockAnimalTypes);

        const response = await request(app).get('/');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ animalTypes: mockAnimalTypes });
        expect(PetFinderAPI.prototype.fetchAnimalTypes).toHaveBeenCalled();
    });

    it('should return a 500 status code on internal server error', async () => {
        PetFinderAPI.prototype.fetchAnimalTypes.mockRejectedValue(new Error('Internal server error'));

        const response = await request(app).get('/');
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
        expect(PetFinderAPI.prototype.fetchAnimalTypes).toHaveBeenCalled();
    });
});

const request = require('supertest');
const express = require('express');
const PetFinderAPI = require('../helpers/apiHelper');
const petsRouter = require('../routes/pets'); 

jest.mock('../helpers/apiHelper'); // Mock the API helper

describe('Pets Router', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/', petsRouter);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    // Test for retrieving pets with optional type filtering
describe('GET /', () => {
    it('should return a list of pets based on type', async () => {
        const mockPets = { animals: [{ id: 1, name: 'Max' }], pagination: { total_count: 1 } };
        PetFinderAPI.prototype.fetchAnimalByType.mockResolvedValue(mockPets);
        PetFinderAPI.prototype.fetchPets.mockResolvedValue(mockPets);

        const response = await request(app).get('/?type=dog');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPets);
        expect(PetFinderAPI.prototype.fetchAnimalByType).toHaveBeenCalledWith('dog', 1, 10);
    });

    it('should handle invalid animal type', async () => {
        const response = await request(app).get('/?type=invalidType');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid animal type. Valid types include: dog, cat, rabbit, etc.' });
    });
});

// Test for retrieving a specific pet by id
describe('GET /:id', () => {
    it('should return pet details', async () => {
        const mockPetDetails = { id: 1, name: 'Max' };
        PetFinderAPI.prototype.fetchPetById.mockResolvedValue(mockPetDetails);

        const response = await request(app).get('/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPetDetails);
        expect(PetFinderAPI.prototype.fetchPetById).toHaveBeenCalledWith('1');
    });
});

// Test for retrieving pet photos
describe('GET /:id/photos', () => {
    it('should return pet photos', async () => {
        const mockPhotos = { photos: [{ url: 'http://example.com/photo.jpg' }] };
        PetFinderAPI.prototype.fetchPetPhotos.mockResolvedValue(mockPhotos);

        const response = await request(app).get('/1/photos');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPhotos);
        expect(PetFinderAPI.prototype.fetchPetPhotos).toHaveBeenCalledWith('1');
        });
    });
});

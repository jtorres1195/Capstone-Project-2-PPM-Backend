const nock = require('nock');
const PetFinderAPI = require('./PetFinderAPI');

describe('PetFinderAPI', () => {
    let api;
    const baseUrl = 'https://api.petfinder.com/v2';

    beforeEach(() => {
        api = new PetFinderAPI();
        process.env.PET_FINDER_CLIENT_ID = 'test-client-id';
        process.env.PET_FINDER_CLIENT_SECRET = 'test-client-secret';
        process.env.PET_FINDER_BASE_URL = baseUrl;
    });

    afterEach(() => {
        nock.cleanAll();
    });

    // Test Token Fetching
    describe('fetchToken', () => {
        it('should fetch a new token and set it correctly', async () => {
            const mockResponse = {
                access_token: 'new-access-token',
                expires_in: 3600
            };
            nock(baseUrl)
                .post('/oauth2/token')
                .reply(200, mockResponse);

            await api.fetchToken();

            expect(api.accessToken).toBe('new-access-token');
            expect(api.tokenExpiration).toBeGreaterThan(Date.now());
        });

        it('should handle failure in token fetching', async () => {
            nock(baseUrl)
                .post('/oauth2/token')
                .reply(400, { error: 'Bad Request' });

            await expect(api.fetchToken()).rejects.toThrow('Failed to obtain access token');
        });
    });

    // Test Pet Fetching with Decoding
    describe('fetchPets', () => {
        beforeEach(() => {
            api.accessToken = 'valid-token';
            api.tokenExpiration = Date.now() + 100000; // set token to be valid
        });

        it('should fetch pets and decode HTML descriptions', async () => {
            nock(baseUrl, {
                reqheaders: {
                    Authorization: `Bearer valid-token`
                }
            })
                .get('/animals?page=1&offset=0&limit=10')
                .reply(200, {
                    animals: [{ id: 1, description: 'Friendly &amp; loving' }],
                    pagination: { total_count: 1 }
                });

            const result = await api.fetchPets(1, 10);

            expect(result.animals[0].description).toBe('Friendly & loving');
            expect(result.pagination.total_count).toBe(1);
        });

        it('should return empty array when no pets are found', async () => {
            nock(baseUrl, {
                reqheaders: {
                    Authorization: `Bearer valid-token`
                }
            })
                .get('/animals?page=1&offset=0&limit=10')
                .reply(200, { animals: [], pagination: { total_count: 0 } });

            const result = await api.fetchPets(1, 10);

            expect(result.animals.length).toBe(0);
            expect(result.pagination.total_count).toBe(0);
        });

        it('should handle API errors during pets fetching', async () => {
            nock(baseUrl, {
                reqheaders: {
                    Authorization: `Bearer valid-token`
                }
            })
                .get('/animals?page=1&offset=0&limit=10')
                .reply(500, { error: 'Internal Server Error' });

            await expect(api.fetchPets(1, 10)).rejects.toThrow();
        });
    });

    // Test Fetching Single Pet
    describe('fetchPetById', () => {
        beforeEach(() => {
            api.accessToken = 'valid-token';
            api.tokenExpiration = Date.now() + 100000; // token is still valid
        });

        it('should fetch details of a single pet', async () => {
            const petId = 123;
            nock(baseUrl, {
                reqheaders: {
                    Authorization: `Bearer valid-token`
                }
            })
                .get(`/animals/${petId}`)
                .reply(200, {
                    animal: { id: petId, name: 'Rex' }
                });

            const result = await api.fetchPetById(petId);

            expect(result.animal.id).toBe(petId);
            expect(result.animal.name).toBe('Rex');
        });

        it('should handle errors when fetching a single pet', async () => {
            const petId = 123;
            nock(baseUrl, {
                reqheaders: {
                    Authorization: `Bearer valid-token`
                }
            })
                .get(`/animals/${petId}`)
                .reply(404, { error: 'Pet not found' });

            await expect(api.fetchPetById(petId)).rejects.toThrow();
        });
    });

    describe('fetchPetPhotos', () => {
        it('should fetch photos for a given pet id', async () => {
            const petId = 1;
            nock(baseUrl)
                .get(`/animals/${petId}/photos`)
                .reply(200, { photos: [{ url: 'http://example.com/photo1.jpg' }] });

            const result = await api.fetchPetPhotos(petId);
            expect(result.photos[0].url).toBe('http://example.com/photo1.jpg');
        });
    });

    describe('fetchAnimalTypes', () => {
        it('should fetch all animal types', async () => {
            nock(baseUrl)
                .get('/types')
                .reply(200, { types: ['Dog', 'Cat'] });

            const types = await api.fetchAnimalTypes();
            expect(types.length).toBe(2);
            expect(types).toEqual(['Dog', 'Cat']);
        });

        it('should handle errors when fetching animal types', async () => {
            nock(baseUrl)
                .get('/types')
                .reply(500);

            await expect(api.fetchAnimalTypes()).rejects.toThrow();
        });
    });

    describe('fetchAnimalByType', () => {
        it('should fetch animals by type with pagination', async () => {
            const type = 'dog';
            const page = 1;
            const limit = 10;
            nock(baseUrl)
                .get(`/animals?type=${encodeURIComponent(type)}&page=${page}&offset=0&limit=${limit}`)
                .reply(200, {
                    animals: [{ id: 1, name: 'Buddy' }],
                    pagination: { total_count: 1 }
                });

            const result = await api.fetchAnimalByType(type, page, limit);
            expect(result.animals.length).toBe(1);
            expect(result.animals[0].name).toBe('Buddy');
            expect(result.pagination.total_count).toBe(1);
        });

        it('should return empty arrays when no animals match the type', async () => {
            const type = 'unicorn';
            const page = 1;
            const limit = 10;
            nock(baseUrl)
                .get(`/animals?type=${encodeURIComponent(type)}&page=${page}&offset=0&limit=${limit}`)
                .reply(200, { animals: [], pagination: { total_count: 0 } });

            const result = await api.fetchAnimalByType(type, page, limit);
            expect(result.animals.length).toBe(0);
            expect(result.pagination.total_count).toBe(0);
        });
    });

    describe('fetchFeaturedPets', () => {
        it('should fetch featured pets', async () => {
            nock(baseUrl)
                .get(`/animals?random`)
                .reply(200, {
                    animals: [{ id: 1, name: 'Fido', description: 'Friendly &amp; playful' }]
                });

            const result = await api.fetchFeaturedPets();
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Fido');
            expect(result[0].description).toBe('Friendly & playful');
        });

        it('should handle errors during fetching featured pets', async () => {
            nock(baseUrl)
                .get(`/animals?random`)
                .reply(500);

            await expect(api.fetchFeaturedPets()).rejects.toThrow();
        });
    });
});


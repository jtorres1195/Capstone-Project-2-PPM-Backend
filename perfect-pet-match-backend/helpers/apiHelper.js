const axios = require('axios');
const he = require('he');
require('dotenv').config();

class PetFinderAPI {
    constructor() {
        this.clientId = process.env.PET_FINDER_CLIENT_ID;
        this.clientSecret = process.env.PET_FINDER_CLIENT_SECRET;
        this.BASE_URL = process.env.PET_FINDER_BASE_URL || 'https://api.petfinder.com/v2';
        this.accessToken = null;
        this.tokenExpiration = null;
    }

    decodeHtml(html) {
        return he.decode(html);
    }

    // Function to fetch new access token
    async fetchToken() {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', this.clientId);
        params.append('client_secret', this.clientSecret);

        try {
        const response = await axios.post(
            `${this.BASE_URL}/oauth2/token`,
            params,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

            this.accessToken = response.data.access_token;
            this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);
            console.log('Token fetched and set successfully.');
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching access token:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Request config:', error.config);
            }
            throw new Error('Failed to obtain access token');
        }
    }

    // Ensures the token is fresh before making a request
    async ensureAuthenticatedToken() {
        if (!this.accessToken || Date.now() >= this.tokenExpiration - 60000) {
            console.log('Access token is expired or not set, fetching a new one.');
            await this.fetchToken(); // Fetch a new token
        }
        return this.accessToken;
    }

    // Make a request to the PetFinder API
    async makePetFinderRequest(endpoint) {
        const petApiToken = await this.ensureAuthenticatedToken();
        const url = `${this.BASE_URL}${endpoint}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${petApiToken}`,
                },
            });
            console.log("API Response Data:", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error making request to PetFinder API with URL ${url}:`, error);
            throw error;
        }
    }

    async fetchPets(page, limit) {
        const offset = (page - 1) * limit;
        const endpoint = `/animals?page=${page}&offset=${offset}&limit=${limit}`;
        try {
            const response = await this.makePetFinderRequest(endpoint);
            if (response && response.animals && response.pagination) {
                const petsWithDecodedDescriptions = response.animals.map(animal => ({
                    ...animal,
                    description: animal.description ? this.decodeHtml(animal.description) : ''
                }));
                return {
                    animals: petsWithDecodedDescriptions,
                    pagination: response.pagination
                };
            }
            return { animals: [], pagination: { total_count: 0 } };
        } catch (error) {
            console.error('Error fetching pets:', error);
            throw error;
        }
    }
    

    async fetchPetById() {
        return this.makePetFinderRequest(`/animals/{id}`);
    }

    async fetchPetPhotos() {
        return this.makePetFinderRequest(`/animals/{id}/photos`);
    }

    async fetchAnimalTypes() {
        try {
            const response = await this.makePetFinderRequest('/types');
            return response.types || [];
        } catch (error) {
            console.error('Error fetching pet types:', error);
            throw error;
        }
    }

    async fetchAnimalByType(type, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const endpoint = `/animals?type=${encodeURIComponent(type)}&page=${page}&offset=${offset}&limit=${limit}`;

        try {
            const response = await this.makePetFinderRequest(endpoint);
            if (response && response.animals && response.pagination) {
                const animalsWithDecodedDescriptions = response.animals.map(animal => ({
                    ...animal,
                    description: animal.description ? this.decodeHtml(animal.description) : ''
                }));
                return {
                    animals: animalsWithDecodedDescriptions,
                    pagination: response.pagination
                };
            } else {
                return { animals: [], pagination: { total_count: 0 } };
            }
        } catch (error) {
            console.error(`Error fetching animals of type ${type}:`, error);
            throw error;
        }
    }
    
    async fetchFeaturedPets() {
        try {
            const response = await this.makePetFinderRequest(`/animals?random`);
            return response.animals.map(animal => ({
                ...animal,
                description: animal.description ? this.decodeHtml(animal.description) : ''
            }));
        } catch (error) {
            console.error('Error fetching featured pets:', error);
            throw error;
        }
    }
}

module.exports = PetFinderAPI;

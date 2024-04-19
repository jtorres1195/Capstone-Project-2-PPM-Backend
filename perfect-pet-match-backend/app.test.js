const request = require('supertest');
const app = require('./app'); 

describe('Application routes and middleware', () => {
    describe('GET /nonexistent', () => {
        it('should return 404 for non-existent routes', async () => {
            const response = await request(app).get('/nonexistent');
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ error: 'Endpoint Not Found' });
        });
    });
    
    describe('Error Handling', () => {
        it('should handle internal server errors', async () => {
            const response = await request(app).get('/causeError');
            expect(response.statusCode).toBe(500);
            expect(response.text).toContain('Internal Server Error');
        });
    });
    
    // Test CORS headers
    describe('CORS Settings', () => {
        it('should allow cross-origin requests from the specific origin', async () => {
            const response = await request(app).get('/pets'); // Checking CORS on any route
            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        });
    });
});

const axios = require('axios');
const {
    authenticateToken,
    fetchToken,
    authenticateWithPetfinder,
    setAccessToken
} = require('../middleware/auth'); 

// Mock the axios module
jest.mock('axios');

describe('Middleware Authentication Tests', () => {
    describe('fetchToken', () => {
        test('fetches token successfully', async () => {
            // Mock the axios post request and its response
            axios.post.mockResolvedValueOnce({
                data: {
                    access_token: 'mock-access-token',
                    expires_in: 3600 // 1 hour in seconds
                }
            });
        
            // Call the function
            await fetchToken();
        
            // Assert that the function sets the accessToken and tokenExpiration correctly
            expect(setAccessToken).toHaveBeenCalledWith('mock-access-token');
        });

        test('throws error if token fetching fails', async () => {
            // Mock the axios post request to throw an error
            axios.post.mockRejectedValueOnce(new Error('Failed to fetch token'));

            // Call the function and expect it to throw an error
            await expect(fetchToken()).rejects.toThrow('Failed to obtain access token');
        });
    });

    describe('authenticateWithPetfinder', () => {
        test('returns existing access token if not expired', async () => {
            // Set the initial values of accessToken and tokenExpiration
            setAccessToken('mock-access-token');
            tokenExpiration = Date.now() + 3600000; // 1 hour in milliseconds

            // Call the function and assert that it returns the expected value
            const result = await authenticateWithPetfinder();
            expect(result).toEqual('mock-access-token');
        });

        test('fetches new token if expired', async () => {
            // Set the initial values of accessToken and tokenExpiration
            setAccessToken(null);
            tokenExpiration = Date.now() - 1000; // Set expiration 1 second ago

            // Mock the axios post request and its response
            axios.post.mockResolvedValueOnce({
                data: {
                    access_token: 'new-mock-access-token',
                    expires_in: 3600 // 1 hour in seconds
                }
            });

            // Call the function and assert that it returns the expected value
            const result = await authenticateWithPetfinder();
            expect(result).toEqual('new-mock-access-token');
        });
    });

    describe('authenticateToken', () => {
        test('calls next middleware if token is provided and valid', async () => {
            // Set the initial value of accessToken
            setAccessToken('mock-access-token');

            // Mock request and response objects
            const mockRequest = {
                header: jest.fn().mockReturnValueOnce('Bearer mock-access-token')
            };
            const mockResponse = {};
            const mockNext = jest.fn();

            // Call the function and assert that it calls the next middleware
            await authenticateToken(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });

        test('sends 403 response if token authentication fails', async () => {
            // Set the initial value of accessToken to null
            setAccessToken(null);

            // Mock request and response objects
            const mockRequest = {
                header: jest.fn().mockReturnValueOnce('Bearer invalid-token')
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockNext = jest.fn();

            // Call the function and assert that it sends the expected response
            await authenticateToken(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Unable to authenticate with Petfinder' });
        });
    });
});

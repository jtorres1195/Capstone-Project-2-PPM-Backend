const axios = require('axios');

let accessToken = null;
let tokenExpiration = null;

const setAccessToken = (newAccessToken) => {
    accessToken = newAccessToken;
};

// Function to fetch new access token
const fetchToken = async () => {
    try {
        const response = await axios.post(
            'https://api.petfinder.com/v2/oauth2/token', 
            {
                grant_type: 'client_credentials',
                client_id: 'uz6vwnORLY4GdyGNXASQTtN75lWsM1eLmlaRu5IAjLzwjWjw55',
                client_secret: '5uHeeTuLf2M0JbNcY3cRveC3HYE1bS1clLq6Sta9',
            },
            {
                headers: {
                    accept: 'application/json'
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiration = Date.now() + (response.data.expires_in * 1000);
    } catch (error) {
        console.error('Error fetching access token:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error('Failed to obtain access token');
    }
};

// Function to authenticate with Petfinder and fetch access token
const authenticateWithPetfinder = async () => {
    // Check if token is expired or close to expiration
    if (!accessToken || Date.now() >= tokenExpiration - 60000 /* 1 minute */) {
        await fetchToken(); // Fetch a new token
    }
    return accessToken;
};

// Middleware function to check for a valid token
const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token'});
    }

    // Verify the token and obtain access token from Petfinder API
    try {
        const access_token = await authenticateWithPetfinder(token);
        console.log("authenticate token", access_token);
        req.access_token = access_token;
        next();
    } catch (error) {
        console.error('Error authenticating with PetFinder:', error);
        return res.status(403).json({ message: 'Forbidden: Unable to authenticate with Petfinder' });
    }
};

module.exports = { authenticateToken, fetchToken, authenticateWithPetfinder, setAccessToken };

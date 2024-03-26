const crypto = require('crypto');

const generateJWTSecretKey = () => {
    const jwtSecretKey = crypto.randomBytes(32).toString('base64');
    return jwtSecretKey;
};

const secretKey = generateJWTSecretKey();
console.log('JWT Secret Key:', secretKey);

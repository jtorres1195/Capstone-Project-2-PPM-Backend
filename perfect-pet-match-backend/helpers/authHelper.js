const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
const User = require('../models/User');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const generateToken = (userId) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized: Missing token' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

async function authenticateUser(req, res, next) {
    const { email, password: providedPassword } = req.body;

    if (!providedPassword || !email) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        console.log({ providedPassword, hashedPassword: user.password_hash });
        const isPasswordValid = await bcrypt.compare(providedPassword, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(user.id); // Ensure the user object has an id field
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { authenticateUser, generateToken, verifyToken };
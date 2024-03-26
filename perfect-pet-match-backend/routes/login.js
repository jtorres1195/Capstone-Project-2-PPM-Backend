const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password: providedPassword } = req.body;

    if (!providedPassword || !email) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        console.log(providedPassword, user.password_hash);
        const isPasswordValid = await bcrypt.compareSync(providedPassword, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.rows.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRouter = require('../routes/authRouter'); // Assuming the file name

jest.mock('../models/User'); // Mock the User model
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Authentication Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(authRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /signup', () => {
        it('should register a new user if email does not exist', async () => {
            User.checkIfUserExists.mockResolvedValue(false);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.createUser.mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com' });
    
            const response = await request(app)
                .post('/signup')
                .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({
                message: 'User registered successfully',
                user: { id: 1, username: 'testuser', email: 'test@example.com' }
            });
        });
    
        it('should return 400 if user already exists', async () => {
            User.checkIfUserExists.mockResolvedValue(true);
    
            const response = await request(app)
                .post('/signup')
                .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({
                message: 'User already exists'
            });
        });
    });
    

    describe('POST /login', () => {
        it('should log in an existing user with correct credentials', async () => {
            User.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com', password_hash: 'hashedpassword' });
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');
    
            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: 'Login successful',
                token: 'token'
            });
        });
    
        it('should return 401 for invalid password', async () => {
            User.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com', password_hash: 'hashedpassword' });
            bcrypt.compareSync.mockReturnValue(false);
    
            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });
    
            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({
                message: 'Invalid password'
            });
        });
    });
    

    describe('POST /logout', () => {
        it('should clear the cookie and logout the user', async () => {
            const response = await request(app).post('/logout');
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: 'Logout successful'
            });
        });
    });    
});

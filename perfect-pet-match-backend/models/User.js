const db = require("../db");
const bcrypt = require("bcrypt");

class User {
    constructor(id, username, email, password_hash, profilePicture) {
        this.userId = id;
        this.username = username;
        this.email = email;
        this.password = password_hash;
        this.profilePicture = profilePicture;
    }

    // Method to check if a user already exists
    static async checkIfUserExists(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows.length > 0;
    }

    // Method to find a user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        try {
            const result = await db.query(query, [email]);
            if (result.rows.length > 0) {
                return result.rows[0]; // Return the found user
            } else {
                return null; // No user found with this email
            }
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error; // Rethrow or handle as needed
        }
    }

    // Create a new user
    static async createUser(username, email, password) {
        const query = `
            INSERT INTO users(username, email, password_hash) 
            VALUES($1, $2, $3)
            RETURNING id;
        `;
        const values = [username, email, bcrypt.hashSync(password, 20)];
        try {
            const res = await db.query(query, values);
            return res.rows[0];
        } catch (error) {
            throw error;
        }
    }


    // Method to find favorite pets for a user
    static async findFavoritePets(id) {
        try {
            const query = ' SELECT * FROM favorite_pets WHERE id = $1';
            const result = await db.query(query, [id]);
            return result.rows;
        } catch (error) {
            console.error('Error finding favorite pets:', error);
            throw error;
        }
    }

    static async addPet(id, petId) {
        const query = 'INSERT INTO user_pets (id, pet_id) VALUES ($1, $2)';
        await db.query(query, [id, petId]);
    }

    // Method to find saved pets for a user
    static async findSavedPets(id) {
        try {
            const query = ' SELECT * FROM user_pets WHERE user_id = $1';
            const result = await db.query(query, [id]);
            return result.rows;
        } catch (error) {
            console.error('Error finding saved pets:', error);
            throw error;
        }
    }
}

module.exports = User;
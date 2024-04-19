const db = require("../db");

class SavedPets {
    constructor(id, userId, petId, createdAt) {
        this.id = id;
        this.userId = userId;
        this.petId = petId;
        this.createdAt = createdAt;
    }

    static async getAllSavedPets() {
        try {
            const query = 'SELECT * FROM favorite_pets';
            const { rows } = await db.query(query);
            return rows.map(row => new SavedPets(
                row.id,
                row.user_id,
                row.pet_id,
                row.created_at
            ));
        } catch (error) {
            console.error('Error fetching saved pets:', error);
            throw error;
        }
    }

    static async addSavedPet(userId, petId) {
        try {
            const query = 'INSERT INTO favorite_pets (user_id, pet_id) VALUES ($1, $2) RETURNING *';
            const values = [userId, petId];
            const { rows } = await db.query(query, values);
            if (rows.length === 0) return null;
            const row = rows[0];
            return new SavedPets(
                row.id,
                row.user_id,
                row.pet_id,
                row.created_at
            );
        } catch (error) {
            console.error('Error adding saved pet:', error);
            throw error;
        }
    }

    static async removeSavedPet(id) {
        try {
            const query = 'DELETE FROM favorite_pets WHERE id = $1';
            await db.query(query, [id]);
            return true;
        } catch (error) {
            console.error('Error removing saved pet:', error);
            throw error;
        }
    }

    static async findSavedByUserId(userId) {
        try {
            const query = 'SELECT * FROM favorite_pets WHERE user_id = $1';
            const { rows } = await db.query(query, [userId]);
            return rows.map(row => new SavedPets(
                row.id,
                row.user_id,
                row.pet_id,
                row.created_at
            ));
        } catch (error) {
            console.error(`Error fetching saved pets for user ${userId}:`, error);
            throw error;
        }
    }
}

module.exports = SavedPets;

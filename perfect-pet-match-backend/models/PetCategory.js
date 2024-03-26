const db = require("../db");

class PetCategory {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    static async createCategories(name, description) {
        try {
            const query = 'INSERT INTO pet_categories (name, description) VALUES ($1, $2) RETURNING *';
            const values = [name, description];
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error creating pet category:', error);
            throw error;
        }
    }

    static async getAllCategories() {
        try {
            const query = 'SELECT * FROM pet_categories';
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            console.error('Error fetching pet category:', error);
            throw error;
        }
    }
}

module.exports = PetCategory;
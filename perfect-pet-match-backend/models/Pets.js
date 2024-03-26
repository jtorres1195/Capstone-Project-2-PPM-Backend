const db = require("../db");

class Pets {
    constructor(id, name, species, age, size, gender, breed, color, coat, location, status) {
        this.petId = id;
        this.name = name;
        this.species = species;
        this.age = age;
        this.size = size;
        this.gender = gender;
        this.breed = breed;
        this.color = color;
        this.coat = coat;
        this.location = location;
        this.status = status;
    }

    static async getAllPets() {
        try {
            const query = 'SELECT * FROM pets';
            const { rows } = await db.query(query);
            return rows.map(row => new Pets(
                row.petId,
                row.name,
                row.species,
                row.age,
                row.size,
                row.gender,
                row.breed,
                row.color,
                row.location,
                row.status
            ));
        } catch (error) {
            console.error('Error fetching pets:', error);
            throw error;
        }
    }

    static async getPetById(id) {
        try {
            const query = 'SELECT * FROM pets WHERE id = $1';
            const { rows } = await db.query(query, [id]);
            if (rows.length === 0) return null; // Pet not found
            const row = rows[0];
            return new Pets(
                row.petId,
                row.name,
                row.species,
                row.age,
                row.size,
                row.gender,
                row.breed,
                row.color,
                row.location,
                row.status
            );
        } catch (error) {
            console.error('Error fetching pet by ID:', error);
            throw error;
        }
    }

    static async updatePet(id, name, age, species) {
        try {
            const query = 'UPDATE pets SET name = $1, age = $2, species = $3 WHERE id = $4 RETURNING *';
            const values = [name, age, species, id];
            const { rows } = await db.query(query, values);
            if (rows.length === 0) return null; // Pet not found
            const row = rows[0];
            return new Pets(
                row.petId,
                row.name,
                row.species,
                row.age,
                row.size,
                row.gender,
                row.breed,
                row.color,
                row.location,
                row.status
            );
        } catch (error) {
            console.error('Error updating pets:', error);
            throw error;
        }
    }

    static async deletePet(id) {
        try {
            const query = 'DELETE FROM pets WHERE id = $1';
            await db.query(query, [id]);
            return true;
        } catch (error) {
            console.error('Error deleting pets:', error);
            throw error;
        }
    }
}

module.exports = Pets;

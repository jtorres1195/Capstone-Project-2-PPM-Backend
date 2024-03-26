const db = require('../db');

class PetInteraction {
    constructor(userId, petId, interactionType, details) {
        this.userId = userId;
        this.userId = petId;
        this.interactionType = interactionType;
        this.details = details;
    }

    static async recordInteraction(userId, petId, interactionType, details) {
        try {
            const query = 'INSERT INTO pet_interactions (user_id, pet_id, interaction_type, details) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [userId, petId, interactionType, details];
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Error recording pet interaction:', error);
            throw error;
        }
    }
}

module.export = PetInteraction;
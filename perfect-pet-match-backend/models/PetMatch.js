const db = require('../db');

class PetMatch {
    constructor(matchId, userId, name, species, age, size, gender, breed, color, coat, good_with_children, good_with_dogs, good_with_cats, house_trained, declawed, special_needs, distance, location, status, matchedPets) {
        this.matchId = matchId;
        this.userId = userId;
        this.name = name;
        this.species = species;
        this.age = age;
        this.size = size;
        this.gender = gender;
        this.breed = breed;
        this.color = color;
        this.coat = coat;
        this.good_with_children = good_with_children;
        this.good_with_dogs = good_with_dogs;
        this.good_with_cats = good_with_cats;
        this.house_trained = house_trained;
        this.declawed = declawed;
        this.special_needs = special_needs;
        this.distance = distance;
        this.location = location;
        this.adoptionStatus = status;
        this.matchedPets = matchedPets;
    }

    static async findMatches(matchId, name, species, age, size, gender, breed, color, coat, good_with_children, good_with_dogs, good_with_cats, house_trained, declawed, special_needs, distance, location, status, matchedPets) {
        try {
            const query = 'SELECT * FROM pets WHERE name = $1 AND species <= $2 AND age = $3 AND size = $4 AND gender = $5 AND breed = $6 AND location = $7 AND adoptionStatus = $8';
            const values = [matchId, name, species, age, size, gender, breed, color, coat, good_with_children, good_with_dogs, good_with_cats, house_trained, declawed, special_needs, distance, location, status, matchedPets];

            if (sortBy && sortOrder) {
                query += ` ORDER BY ${sortBy} ${sortOrder}`;
            }

            if (limit && offset) {
                query += ' LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
                values.push(limit, offset);
            }

            const { rows } = await db.query(query, values);
            return rows;
        } catch (error) {
            console.error('Error finding pet matches:', error);
            throw error;
        }
    }
}

module.exports = PetMatch;
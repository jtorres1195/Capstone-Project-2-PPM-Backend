CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    age INTEGER,
    size VARCHAR(20),
    gender VARCHAR(10),
    breed VARCHAR(100),
    color VARCHAR(50),
    coat VARCHAR(20),
    location VARCHAR(100),
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE saved_pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pet
        FOREIGN KEY(pet_id)
        REFERENCES pets(id) 
        ON DELETE CASCADE
);

CREATE TABLE petPreferences (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL,
    name VARCHAR(100),
    species VARCHAR(50),
    age INT,
    size VARCHAR(50),
    gender VARCHAR(10),
    breed VARCHAR(50),
    color VARCHAR(50),
    coat VARCHAR(20),
    good_with_children BOOLEAN,
    good_with_dogs BOOLEAN,
    good_with_cats BOOLEAN,
    house_trained BOOLEAN,
    declawed BOOLEAN,
    special_needs BOOLEAN,
    distance INT,
    location VARCHAR(100),
    status VARCHAR(50),
    matched_pets JSONB,
    CONSTRAINT fk_pet
        FOREIGN KEY(pet_id)
        REFERENCES pets(id) 
        ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
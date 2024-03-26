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

CREATE TABLE email_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorite_pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pet
        FOREIGN KEY(pet_id)
        REFERENCES pets(id) 
        ON DELETE CASCADE
);

CREATE TABLE petInteraction (
    interaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    pet_id INT NOT NULL,
    interaction_type VARCHAR(50),
    interaction_date TIMESTAMP,
    additional_details TEXT
);

CREATE TABLE petMatch (
    match_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
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
    matched_pets JSONB
);

CREATE TABLE petCategory (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    description TEXT
);

CREATE TABLE featured_pets (
    pet_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    species VARCHAR(100),
    breed VARCHAR(100),
    color VARCHAR(50),
    age INTEGER,
    size VARCHAR(20),
    location VARCHAR(255),
    status VARCHAR(50)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pet
        FOREIGN KEY(pet_id)
        REFERENCES pets(id)
        ON DELETE CASCADE
);

CREATE DATABASE anime_test;

CREATE TABLE anime(
    id INTEGER PRIMARY KEY,
    romaji_title VARCHAR(100),
    english_title VARCHAR(100),
    description VARCHAR(3000),
    status VARCHAR(15),
    season VARCHAR(20),
    episodes INTEGER,
    duration INTEGER,
    start_date DATE,
    end_date DATE
);

CREATE TABLE manga(
    id INTEGER PRIMARY KEY,
    romaji_title VARCHAR(100),
    english_title VARCHAR(100),
    description VARCHAR(3000),
    status VARCHAR(15),
    volumes INTEGER,
    chapters INTEGER,
    start_date DATE,
    end_date DATE
);

CREATE TABLE "character"(
    id INTEGER PRIMARY KEY,
    name VARCHAR(80),
    gender VARCHAR(10),
    description VARCHAR(9200)
);

CREATE TABLE studio(
    id INTEGER PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE "user"(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    gender VARCHAR(30),
    joined DATE
);





CREATE TABLE anime_manga(
    anime_id INTEGER REFERENCES anime(id),
    manga_id INTEGER REFERENCES manga(id),
    PRIMARY KEY (animeID, mangaID)
);

CREATE TABLE anime_character(
    anime_id INTEGER REFERENCES anime(id),
    character_id INTEGER REFERENCES character(id),
    PRIMARY KEY (anime_id, character_id)
);

CREATE TABLE anime_studio(
    anime_id INTEGER REFERENCES anime(id),
    studio_id INTEGER REFERENCES studio(id),
    price INTEGER,
    PRIMARY KEY (anime_id, studio_id)
);

CREATE TABLE anime_genre(
    anime_id INTEGER REFERENCES anime(id),
    genre VARCHAR(20),
    PRIMARY KEY (anime_id, genre)
);
